package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "sso")
public class SSOConfig {
    private static final String API_KEY = "SSO_API_KEY";
    private String endpoint;

    public SSOConfig() {
    }

    public SSOConfig(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getEndpoint() {
        return endpoint;
    }

    public void setEndpoint(String endpoint) {
        this.endpoint = endpoint;
    }

    public String getAPIKey() {
        return System.getenv(API_KEY);
    }
}
