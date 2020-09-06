package com.bulletjournal.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class VersionConfig {

    public VersionConfig() {
    }

    public String getVersion() {
        try {
            return System.getenv("API_VERSION");
        } catch (Exception e) {
            return "";
        }
    }

}
