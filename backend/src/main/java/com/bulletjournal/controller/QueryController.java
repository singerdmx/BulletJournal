package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
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
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;
import java.util.stream.Collectors;


@RestController
public class QueryController {

    protected static final String SEARCH_ROUTE = "/api/query";
    private static final Logger LOGGER = LoggerFactory.getLogger(NoteController.class);

    @Autowired
    private SearchIndexDaoJpa searchIndexDaoJpa;
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
     *
     * @param term user input term to be searched in Elastic Search DB
     * @return a list of returned Search Indices
     */
    @GetMapping(SEARCH_ROUTE)
    @ResponseStatus(HttpStatus.OK)
    public List<SearchHit<SearchIndex>> search(@Valid @RequestParam @NotBlank String term) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return searchIndexDaoJpa.search(username, term).getSearchHits();
    }

    /**
     * Validate search results present in DB. If not present, will filter out the indices.
     * TODO: Remove Invalid Search Indices
     *
     * @param searchIndices list of search indices
     * @param username      requester username
     * @return a list of search indices after filtered
     */
    private List<SearchIndex> validateSearchResults(List<SearchIndex> searchIndices, String username) {
        return searchIndices
                .stream()
                .filter(s -> searchResultExists(s, username))
                .collect(Collectors.toList());
    }

    /**
     * Called by validateSearchResults to validate single search index
     *
     * @param searchIndex target search index
     * @param username    requester username
     * @return boolean whether the search result is valid
     */
    private boolean searchResultExists(SearchIndex searchIndex, String username) {
        String searchIndexId = searchIndex.getParentId();
        String type = searchIndexId.substring(0, searchIndexId.indexOf('@'));
        String id = searchIndexId.substring(searchIndexId.indexOf('@') + 1);
        if (StringUtils.isBlank(type) || StringUtils.isBlank(id)) {
            throw new IllegalStateException("Search Index Format is Incorrect");
        }

        ProjectItemDaoJpa projectItemDaoJpa = getProjectItemDao(type);
        return projectItemDaoJpa.getProjectItem(Long.parseLong(id), username) != null;
    }

    /**
     * Get Project Item Dao based on input type
     *
     * @param type requested dao type
     * @return ProjectItemDao instance
     */
    private ProjectItemDaoJpa getProjectItemDao(String type) {
        switch (type) {
            case "task":
                return taskDaoJpa;
            case "transaction":
                return transactionDaoJpa;
            case "note":
                return noteDaoJpa;
            default:
                throw new IllegalArgumentException("Cannot recognize input type");
        }
    }
}
