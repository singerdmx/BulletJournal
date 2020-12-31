package com.bulletjournal.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class GoogleMapsClientConfig {

    private static final String API_KEY = "GOOGLE_MAPS_API_KEY";

    public String getApiKey() {
        return System.getenv(API_KEY);
    }

}