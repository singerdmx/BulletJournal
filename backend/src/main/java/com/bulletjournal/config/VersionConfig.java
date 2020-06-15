package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
public class VersionConfig {

    private String version;

    public VersionConfig() {
    }

    public String getVersion() {
        return System.getenv("API_VERSION");
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
