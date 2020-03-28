package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import org.slf4j.MDC;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.elasticsearch.action.search.SearchRequest;
import org.elasticsearch.action.search.SearchResponse;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.elasticsearch.common.unit.Fuzziness;
import org.elasticsearch.index.query.QueryBuilders;
import org.elasticsearch.search.builder.SearchSourceBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import java.io.IOException;


@RestController
public class QueryController {

    protected static final String SEARCH_ROUTE = "/api/query";

    private static final Logger LOGGER = LoggerFactory.getLogger(NoteController.class);

    @Autowired
    RestHighLevelClient highLevelClient;

    @CrossOrigin(origins = "http://localhost:3000")
    @GetMapping(SEARCH_ROUTE)
    @ResponseStatus(HttpStatus.OK)
    public SearchResponse searchItems(@Valid @RequestParam @NotBlank String term) {
        // return List<ProjectItems>
        // search by title and comment
        // const project_item in service
        String username = MDC.get(UserClient.USER_NAME_KEY);
        SearchRequest searchRequest = new SearchRequest("project_item");
        searchRequest.source(new SearchSourceBuilder().query(
                QueryBuilders.matchQuery("name", term)
                        .fuzziness(Fuzziness.AUTO)
                        .prefixLength(3)
                        .maxExpansions(10)
        ));

        try {
            SearchResponse response = highLevelClient.search(searchRequest, RequestOptions.DEFAULT);
            LOGGER.info(response.toString());
            return response;
        } catch (IOException e) {
            LOGGER.error("", e);
        }
        return null;
    }
}
