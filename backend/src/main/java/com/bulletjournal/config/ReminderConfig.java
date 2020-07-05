package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "reminder")
public class ReminderConfig {
    int loadPrevHours;
    int loadNextHours;
    int purgePrevHours;
    String timeZone;

    public int getLoadPrevHours() {
        return loadPrevHours;
    }

    public void setLoadPrevHours(int loadPrevHours) {
        this.loadPrevHours = loadPrevHours;
    }

    public int getLoadNextHours() {
        return loadNextHours;
    }

    public void setLoadNextHours(int loadNextHours) {
        this.loadNextHours = loadNextHours;
    }

    public int getPurgePrevHours() {
        return purgePrevHours;
    }

    public void setPurgePrevHours(int purgePrevHours) {
        this.purgePrevHours = purgePrevHours;
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
                "loadPrevHours=" + loadPrevHours +
                ", loadNextHours=" + loadNextHours +
                ", purgePrevHours=" + purgePrevHours +
                ", timeZone=" + timeZone +
                '}';
    }
}
