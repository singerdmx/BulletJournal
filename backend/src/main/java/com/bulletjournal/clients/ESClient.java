package com.bulletjournal.clients;

import com.bulletjournal.config.SpringESConfig;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.data.elasticsearch.config.AbstractElasticsearchConfiguration;
import org.springframework.data.elasticsearch.core.ElasticsearchRestTemplate;
import org.springframework.stereotype.Component;

@Component
public class ESClient extends AbstractElasticsearchConfiguration {

    private static final String DEFAULT_CLIENT_VALUE = "spring.elasticsearch.rest.enable";

    @Autowired
    SpringESConfig springESConfig;

    @Bean
    @ConditionalOnProperty(value = DEFAULT_CLIENT_VALUE, havingValue = "true", matchIfMissing = false)
    @Override
    public RestHighLevelClient elasticsearchClient() {
        final ClientConfiguration clientConfiguration = ClientConfiguration.builder()
                .connectedTo(springESConfig.getUris())
                .withBasicAuth(springESConfig.getUsername(), springESConfig.getPassword())
                .build();

        return RestClients.create(clientConfiguration).rest();
    }


    @Bean
    ElasticsearchRestTemplate elasticsearchRestTemplate() {
        return new ElasticsearchRestTemplate(elasticsearchClient());
    }
}

