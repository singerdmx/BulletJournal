package com.bulletjournal.config;

import org.elasticsearch.client.RestHighLevelClient;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.RestClients;

@Configuration
class ESConfig {
    @Autowired
    SpringESConfig springESConfig;

    @Bean
    @ConditionalOnProperty(
            value="spring.elasticsearch.rest.enable",
            havingValue = "true",
            matchIfMissing = false)
    RestHighLevelClient client() {
        ClientConfiguration clientConfiguration = ClientConfiguration.builder()
                .connectedTo(springESConfig.getUris())
                .withBasicAuth(springESConfig.getUsername(), springESConfig.getPassword())
                .build();

        return RestClients.create(clientConfiguration).rest();
    }
}
