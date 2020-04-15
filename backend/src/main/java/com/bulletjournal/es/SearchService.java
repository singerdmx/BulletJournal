package com.bulletjournal.es;

import com.bulletjournal.config.SpringESConfig;
import com.bulletjournal.controller.models.ProjectItem;
import com.bulletjournal.repository.GroupDaoJpa;
import com.bulletjournal.repository.models.Group;
import org.elasticsearch.action.bulk.BulkRequest;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
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

    @Autowired
    private GroupDaoJpa groupDaoJpa;

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
            LOGGER.error("SaveToES fail", e);
        }
    }

    public void saveToESBatch(ProjectItem projectItem, String username) {
        if (highLevelClient == null) {
            return;
        }

        List<String> users = getRelatedUsers(projectItem);
        BulkRequest bulkRequest = new BulkRequest(PROJECT_ITEM, "default");
        for (String user : users) {

            Map<String, Object> json = new HashMap<>();
            json.put("name", projectItem.getName());
            json.put("user", user);

            String index = projectItem.getClass().getSimpleName() + "@" + projectItem.getId();
            IndexRequest request = new IndexRequest(PROJECT_ITEM, "default", index)
                    .source(json)
                    .setRefreshPolicy(WriteRequest.RefreshPolicy.IMMEDIATE);

            bulkRequest.add(request);
        }
        try {
            highLevelClient.bulk(bulkRequest, RequestOptions.DEFAULT);
        } catch (IOException e) {
            LOGGER.error("SaveToESBatch fail", e);
        }
    }

    public List<String> getRelatedUsers(ProjectItem projectItem) {
        List<Group> groupList = groupDaoJpa.getProjectItemGroups(projectItem.getOwner());
        List<String> relatedUsers = new ArrayList<>();
        groupList.forEach(g -> g.getUsers()
                .forEach(userGroup -> relatedUsers.add(userGroup.getUser().getName())));
        return relatedUsers;
    }
}
