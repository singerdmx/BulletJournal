package com.bulletjournal.templates.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class StockApiConfig {

    public String getApiKey() {
        return System.getenv("POLYGON_API_KEY");
    }
}
