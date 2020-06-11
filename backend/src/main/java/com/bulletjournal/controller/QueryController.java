package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
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
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.ArrayList;
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
     * [Query Controller Search API] (Fuzziness Search)
     * Search API takes a string of term and send a search query to Elastic Search JPA with
     * requested term and username.
     * <p>
     * Validate search results before response. If result is invalid, remove search index from
     * elastic search database and skip this result.
     *
     * @param term user input term to be searched in Elastic Search DB
     * @return a list of returned SearchResult. Each search result contains id and list of highlights
     */
    @GetMapping(SEARCH_ROUTE)
    @ResponseStatus(HttpStatus.OK)
    public List<SearchResult> search(@Valid @RequestParam @NotBlank String term) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        List<SearchResult> results = new ArrayList<>();
        List<SearchIndex> invalidResults = new ArrayList<>();

        searchIndexDaoJpa.search(username, term).getSearchHits().forEach(searchHit -> {
            SearchIndex index = searchHit.getContent();

            // If search result is not present in db, add result to invalid results list
            if (!searchResultExists(index, username)) {
                invalidResults.add(index);
                return;
            }
            SearchResult searchResult = new SearchResult();
            searchResult.setId(index.getId());

            // Iterate through highlights and add them to Search Result Highlights
            Map<String, List<String>> highlights = searchHit.getHighlightFields();
            for (String keyword : highlights.keySet()) {
                searchResult.setOrDefaultHighlights(highlights.get(keyword));
            }
            results.add(searchResult);
        });

        // Batch remove all invalid results from ElasticSearch
        searchService.removeInvalidSearchResults(invalidResults);
        return results;
    }

    /**
     * Validate search result still exists.
     * <p>
     * If the "resource not found" exception thrown by DaoJpa, return false to indicate resource not exist.
     * Otherwise, return true only if result is not null.
     *
     * @param searchIndex target search index
     * @param username    requester username
     * @return true if search result is valid
     */
    private boolean searchResultExists(SearchIndex searchIndex, String username) {
        String searchIndexId = searchIndex.getId();
        String type = searchIndexId.substring(0, searchIndexId.indexOf(SEARCH_INDEX_SPLITTER));
        String id = searchIndexId.substring(searchIndexId.indexOf(SEARCH_INDEX_SPLITTER) + 1);

        if (StringUtils.isBlank(type) || StringUtils.isBlank(id)) {
            throw new IllegalStateException("Search Index Format is Incorrect");
        }

        boolean isContent = type.endsWith(CONTENT_TYPE_SUFFIX);

        ProjectItemDaoJpa projectItemDaoJpa = getProjectItemDao(type);

        try {
            return isContent ? projectItemDaoJpa.getContent(Long.parseLong(id), username) != null :
                    projectItemDaoJpa.getProjectItem(Long.parseLong(id), username) != null;
        } catch (Exception ex) {
            return false;
        }
    }

    /**
     * Get ProjectItemDaoJpa based on input type
     *
     * @param type requested dao type
     * @return ProjectItemDao instance
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
                throw new IllegalArgumentException("Cannot recognize input type");
        }
    }
}
