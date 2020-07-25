package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "reminder")
public class ReminderConfig {
    private Long loadPrevSeconds;
    private Long loadNextSeconds;
    private Long purgePrevSeconds;
    private Long cronJobSeconds;
    private String timeZone;

    public Long getLoadPrevSeconds() {
        return loadPrevSeconds;
    }

    public void setLoadPrevSeconds(Long loadPrevSeconds) {
        this.loadPrevSeconds = loadPrevSeconds;
    }

    public Long getLoadNextSeconds() {
        return loadNextSeconds;
    }

    public void setLoadNextSeconds(Long loadNextSeconds) {
        this.loadNextSeconds = loadNextSeconds;
    }

    public Long getPurgePrevSeconds() {
        return purgePrevSeconds;
    }

    public void setPurgePrevSeconds(Long purgePrevSeconds) {
        this.purgePrevSeconds = purgePrevSeconds;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    public Long getCronJobSeconds() {
        return cronJobSeconds;
    }

    public void setCronJobSeconds(Long cronJobSeconds) {
        this.cronJobSeconds = cronJobSeconds;
    }

    @Override
    public String toString() {
        return "ReminderConfig{" +
                "loadPrevSeconds=" + loadPrevSeconds +
                ", loadNextSeconds=" + loadNextSeconds +
                ", purgePrevSeconds=" + purgePrevSeconds +
                ", cronJobSeconds=" + cronJobSeconds +
                ", timeZone='" + timeZone + '\'' +
                '}';
    }
}
