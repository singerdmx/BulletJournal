package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.es.repository.models.SearchIndex;
import com.bulletjournal.repository.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.elasticsearch.core.SearchHit;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.util.List;


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

}
