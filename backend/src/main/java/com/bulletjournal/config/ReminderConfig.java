package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "reminder")
public class ReminderConfig {
    private int loadPrevSeconds;
    private int loadNextSeconds;
    private int purgePrevSeconds;
    private String timeZone;

    public int getLoadPrevSeconds() {
        return loadPrevSeconds;
    }

    public void setLoadPrevSeconds(int loadPrevSeconds) {
        this.loadPrevSeconds = loadPrevSeconds;
    }

    public int getLoadNextSeconds() {
        return loadNextSeconds;
    }

    public void setLoadNextSeconds(int loadNextSeconds) {
        this.loadNextSeconds = loadNextSeconds;
    }

    public int getPurgePrevSeconds() {
        return purgePrevSeconds;
    }

    public void setPurgePrevSeconds(int purgePrevSeconds) {
        this.purgePrevSeconds = purgePrevSeconds;
    }

    public String getTimeZone() {
        return timeZone;
    }

    public void setTimeZone(String timeZone) {
        this.timeZone = timeZone;
    }

    @Override
    public String toString() {
        return "ReminderConfig{" +
                "loadPrevSeconds=" + loadPrevSeconds +
                ", loadNextSeconds=" + loadNextSeconds +
                ", purgePrevSeconds=" + purgePrevSeconds +
                ", timeZone=" + timeZone +
                '}';
    }
}
