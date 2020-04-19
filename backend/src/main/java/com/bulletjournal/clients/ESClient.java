package com.bulletjournal.clients;

import com.bulletjournal.config.SpringESConfig;
import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;
import org.springframework.stereotype.Component;

@Component
public class ESClient {

    private static final String DEFAULT_CLIENT_VALUE = "spring.elasticsearch.rest.enable";

    @Autowired
    SpringESConfig springESConfig;

    @Bean
    @ConditionalOnProperty(value = DEFAULT_CLIENT_VALUE, havingValue = "true", matchIfMissing = false)
    RestHighLevelClient client() {
        ClientConfiguration clientConfiguration = ClientConfiguration.builder()
                .connectedTo(springESConfig.getUris())
                .withBasicAuth(springESConfig.getUsername(), springESConfig.getPassword())
                .build();

        return RestClients.create(clientConfiguration).rest();
    }
}
