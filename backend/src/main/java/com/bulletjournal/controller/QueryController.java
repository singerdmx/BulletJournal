package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.ProjectItemType;
import com.bulletjournal.controller.models.SearchResult;
import com.bulletjournal.es.SearchService;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.es.repository.models.SearchIndex;
import com.bulletjournal.repository.NoteDaoJpa;
import com.bulletjournal.repository.ProjectItemDaoJpa;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.TransactionDaoJpa;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
public class QueryController {

    protected static final String SEARCH_ROUTE = "/api/query";
    private static final Logger LOGGER = LoggerFactory.getLogger(NoteController.class);
    private static final String CONTENT_TYPE_SUFFIX = "content";
    private static final char SEARCH_INDEX_SPLITTER = '@';

    @Autowired
    private SearchIndexDaoJpa searchIndexDaoJpa;
    @Autowired
    private SearchService searchService;
    @Autowired
    private TaskDaoJpa taskDaoJpa;
    @Autowired
    private TransactionDaoJpa transactionDaoJpa;
    @Autowired
    private NoteDaoJpa noteDaoJpa;

    /**
     * Parse Search Index identifier into type and id
     *
     * @param searchIndexInfo search index information
     * @return a pair of type and id
     */
    private static Pair<String, Long> parseSearchIndexInfo(String searchIndexInfo) {
        String type = searchIndexInfo.substring(0, searchIndexInfo.indexOf(SEARCH_INDEX_SPLITTER));
        String id = searchIndexInfo.substring(searchIndexInfo.indexOf(SEARCH_INDEX_SPLITTER) + 1);

        if (StringUtils.isBlank(type) || StringUtils.isBlank(id)) {
            LOGGER.error("QueryController failed to parse search index information");
            throw new IllegalStateException("Search Index Format is wrong");
        }

        return Pair.of(type, Long.parseLong(id));
    }

    /**
     * [Query Controller Search API] (Fuzziness Search)
     * Search API takes a string of term and username to query results from Elastic Search JPA.
     * <p>
     * Validate search results before response. If result is invalid, remove search index from
     * elastic search database and skip this result in the response.
     * <p>
     * SearchResult Model Structure
     * - String ProjectItem Id
     * - String ProjectItem Type
     * - String ProjectItem Name
     * - List[String] HighLights of Name
     * - List[String] HighLights of Content
     *
     * @param term user input term to be searched in Elastic Search DB
     * @return a list of returned SearchResult. Search result contains id and matched highlights
     */
    @GetMapping(SEARCH_ROUTE)
    @ResponseStatus(HttpStatus.OK)
    public List<SearchResult> search(@Valid @RequestParam @NotBlank String term) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        List<SearchIndex> invalidResults = new ArrayList<>();
        List<SearchResult> validResults = search(term, username, invalidResults);

        // Batch remove all invalid results from ElasticSearch
        searchService.removeInvalidSearchResults(invalidResults);
        return validResults;
    }

    /**
     * Search requested term in elastic search and add invalid results to invalid list
     *
     * @param term     requested term
     * @param username requester username
     * @param invalid  list of invalid search indices
     * @return a list of search results with unique id
     */
    private List<SearchResult> search(String term, String username, List<SearchIndex> invalid) {
        // Created a Map to group search result to the same id
        Map<String, SearchResult> results = new HashMap<>();

        searchIndexDaoJpa.search(username, term).getSearchHits().forEach(searchHit -> {
            SearchIndex index = searchHit.getContent();
            boolean isContent = index.getParentId() != null;
            String projectItemId = isContent ? index.getParentId() : index.getId();

            // If search result is not present in database, add result to invalid results list
            String projectItemName = validateSearchResult(index, username);
            if (projectItemName == null) {
                invalid.add(index);
                return;
            }

            Pair<String, Long> identifierPair = parseSearchIndexInfo(projectItemId);

            // Check if map contains search result that has the same id.
            // If yes, reuse the same search result. Otherwise, create a new search result instance.
            SearchResult searchResult = results.getOrDefault(projectItemId, new SearchResult());
            searchResult.setType(ProjectItemType.getType(identifierPair.getFirst()));
            searchResult.setId(identifierPair.getSecond());
            searchResult.setName(projectItemName);

            // Iterate through highlights and add them to Search Result Highlights
            Map<String, List<String>> highlights = searchHit.getHighlightFields();

            if (isContent) {
                // If matched search result is content, set content highlights
                highlights.keySet().forEach(k -> searchResult.addOrDefaultContentHighlights(highlights.get(k)));
            } else {
                highlights.keySet().forEach(k -> searchResult.addOrDefaultNameHighlights(highlights.get(k)));
            }

            results.put(projectItemId, searchResult);
        });
        return new ArrayList<>(results.values());
    }

    /**
     * Validate search result still exists.
     * <p>
     * 1. Determine the search index type.
     * - If type is NAME, search id in project item repo
     * - If type is CONTENT, search content in project content repo and search its parent in project item repo
     * 2. Return project item name, if result is valid. Otherwise, return null.
     *
     * @param searchIndex the target search index
     * @param username    the requester username
     * @return the project item name of the search index
     */
    private String validateSearchResult(SearchIndex searchIndex, String username) {
        Pair<String, Long> searchIndexPair = parseSearchIndexInfo(searchIndex.getId());
        String searchIndexType = searchIndexPair.getFirst();
        Long searchIndexId = searchIndexPair.getSecond();

        // If content type contains suffix as CONTENT
        boolean isContent = searchIndexType.endsWith(CONTENT_TYPE_SUFFIX);

        ProjectItemDaoJpa projectItemDaoJpa = getProjectItemDao(searchIndexType);

        try {
            if (isContent) {
                if (projectItemDaoJpa.getContent(searchIndexId, username) == null)
                    return null;

                searchIndexId = parseSearchIndexInfo(searchIndex.getParentId()).getSecond();
            }

            // If ResourceNotFound or NullPointer exception is thrown, return null
            return projectItemDaoJpa.getProjectItem(searchIndexId, username).getName();
        } catch (Exception ex) {
            return null;
        }
    }

    /**
     * Get ProjectItemDaoJpa based on input type.
     * Both ProjectItem and ProjectItem content return the same DaoJpa.
     *
     * @param type the requested dao type
     * @return the ProjectItemDao instance
     */
    private ProjectItemDaoJpa getProjectItemDao(String type) {
        switch (type) {
            case "task":
            case "task_content":
                return taskDaoJpa;
            case "transaction":
            case "transaction_content":
                return transactionDaoJpa;
            case "note":
            case "note_content":
                return noteDaoJpa;
            default:
                LOGGER.error("QueryController failed to get Project Item Dao");
                throw new IllegalArgumentException("Cannot recognize input type");
        }
    }
}
