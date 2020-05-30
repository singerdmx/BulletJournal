package com.bulletjournal.es;

import com.bulletjournal.config.SpringESConfig;
import com.bulletjournal.repository.GroupDaoJpa;
import org.elasticsearch.client.RestHighLevelClient;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.stereotype.Service;

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

}
