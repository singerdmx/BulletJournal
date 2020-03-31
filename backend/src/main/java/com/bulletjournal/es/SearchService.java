package com.bulletjournal.es;

import com.bulletjournal.config.SpringESConfig;
import com.bulletjournal.controller.models.ProjectItem;
import org.elasticsearch.action.index.IndexRequest;
import org.elasticsearch.action.support.WriteRequest;
import org.elasticsearch.client.RequestOptions;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

@Service
public class SearchService {

    public static final String PROJECT_ITEM = "project_item";

    private static final Logger LOGGER = LoggerFactory.getLogger(SearchService.class);

    @Qualifier("client")
    @Autowired(required = false)
    private RestHighLevelClient highLevelClient;

    @Autowired
    private SpringESConfig springESConfig;

    // TODO user -> project id -> group -> all users
    public void saveToES(ProjectItem projectItem, String username) {
        if (highLevelClient == null) {
            return;
        }

        Map<String, Object> json = new HashMap<>();
        json.put("name", projectItem.getName());
        json.put("user", username);

        String index = projectItem.getClass().getSimpleName() + "@" + projectItem.getId();
        IndexRequest request = new IndexRequest(PROJECT_ITEM, "default", index)
                .source(json)
                .setRefreshPolicy(WriteRequest.RefreshPolicy.IMMEDIATE);
        try {
            highLevelClient.index(request, RequestOptions.DEFAULT);
        } catch (IOException e) {
            LOGGER.error("saveToES fail", e);
        }
    }
}
