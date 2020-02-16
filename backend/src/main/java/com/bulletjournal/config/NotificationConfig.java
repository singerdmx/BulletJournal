package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "notification")
public class NotificationConfig {

    private static class CleanerConfig {
        private int maxRetentionTimeInDays;
        private int intervalInSeconds;
    }

    private CleanerConfig cleaner;
}
