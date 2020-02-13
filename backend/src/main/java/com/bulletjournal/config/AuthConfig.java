package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "auth")
public class AuthConfig {
    private boolean enableDefaultUser;
    private String defaultUsername;
    private String defaultUserTimezone;
    private String defaultUserEmail;

    public String getDefaultUsername() {
        return defaultUsername;
    }

    public void setDefaultUsername(String defaultUsername) {
        this.defaultUsername = defaultUsername;
    }

    public boolean isEnableDefaultUser() {
        return enableDefaultUser;
    }

    public void setEnableDefaultUser(boolean enableDefaultUser) {
        this.enableDefaultUser = enableDefaultUser;
    }

    public String getDefaultUserTimezone() {
        return defaultUserTimezone;
    }

    public void setDefaultUserTimezone(String defaultUserTimezone) {
        this.defaultUserTimezone = defaultUserTimezone;
    }

    public String getDefaultUserEmail() {
        return defaultUserEmail;
    }

    public void setDefaultUserEmail(String defaultUserEmail) {
        this.defaultUserEmail = defaultUserEmail;
    }
}
