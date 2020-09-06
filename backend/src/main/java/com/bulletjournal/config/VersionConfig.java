package com.bulletjournal.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class VersionConfig {

    public VersionConfig() {
    }

    public String getVersion() {
        return System.getenv("API_VERSION") != null ? System.getenv("API_VERSION") : "";
    }

}
