package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "esconfig")
class ESConfig {

    private Integer queryLimit;

    ESConfig() {
    }

    public Integer getQueryLimit() {
        return queryLimit;
    }

    public void setQueryLimit(Integer queryLimit) {
        this.queryLimit = queryLimit;
    }
}
