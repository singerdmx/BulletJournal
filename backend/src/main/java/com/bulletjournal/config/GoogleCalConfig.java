package com.bulletjournal.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "google.calendar")
public class GoogleCalConfig {


    private static final String CLIENT_ID = "GOOGLE_CALENDAR_CLIENT_ID";
    private static final String CLIENT_SECRET = "GOOGLE_CALENDAR_CLIENT_SECRET";

    @Value("${google.calendar.redirect.uri}")
    private String redirectURI;


    public String getClientId() {
        return System.getenv(CLIENT_ID);
    }

    public String getClientSecret() {
        return System.getenv(CLIENT_SECRET);
    }

    public String getRedirectURI() {
        return redirectURI;
    }
}
