package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "revision")
public class ContentRevisionConfig {
    private Integer maxRevisionNumber;

    public Integer getMaxRevisionNumber() {
        return maxRevisionNumber;
    }

    public void setMaxRevisionNumber(Integer maxRevisionNumber) {
        this.maxRevisionNumber = maxRevisionNumber;
    }
}
