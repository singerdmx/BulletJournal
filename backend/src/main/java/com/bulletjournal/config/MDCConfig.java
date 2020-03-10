package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "mdc")
public class MDCConfig {

    private String defaultRequestIdKey;
    private String defaultClientIpKey;
    private String defaultUsernameKey;

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

    public String getDefaultUsernameKey() {
        return defaultUsernameKey;
    }

    public void setDefaultUsernameKey(String defaultUsernameKey) {
        this.defaultUsernameKey = defaultUsernameKey;
    }
}
