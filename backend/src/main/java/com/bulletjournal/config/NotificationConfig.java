package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "notification")
public class NotificationConfig {

    private Cleaner cleaner = new Cleaner();

    public NotificationConfig() {
    }

    public Cleaner getCleaner() {
        return cleaner;
    }

    public void setCleaner(Cleaner cleaner) {
        this.cleaner = cleaner;
    }

    public static class Cleaner {
        private int maxRetentionTimeInDays;
        private int intervalInSeconds;
        private int historyMaxRetentionDays;

        public int getMaxRetentionTimeInDays() {
            return maxRetentionTimeInDays;
        }

        public void setMaxRetentionTimeInDays(int maxRetentionTimeInDays) {
            this.maxRetentionTimeInDays = maxRetentionTimeInDays;
        }

        public int getIntervalInSeconds() {
            return intervalInSeconds;
        }

        public void setIntervalInSeconds(int intervalInSeconds) {
            this.intervalInSeconds = intervalInSeconds;
        }

        public int getHistoryMaxRetentionDays() {
            return historyMaxRetentionDays;
        }

        public void setHistoryMaxRetentionDays(int historyMaxRetentionDays) {
            this.historyMaxRetentionDays = historyMaxRetentionDays;
        }

    }

}
