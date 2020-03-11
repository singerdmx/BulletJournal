package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "mdc")
public class MDCConfig {

    private String defaultRequestIdKey;
    private String defaultClientIpKey;

    public String getDefaultRequestIdKey() {
        return defaultRequestIdKey;
    }

    public void setDefaultRequestIdKey(String defaultRequestIdKey) {
        this.defaultRequestIdKey = defaultRequestIdKey;
    }

    public String getDefaultClientIpKey() {
        return defaultClientIpKey;
    }

    public void setDefaultClientIpKey(String defaultClientIpKey) {
        this.defaultClientIpKey = defaultClientIpKey;
    }

}
