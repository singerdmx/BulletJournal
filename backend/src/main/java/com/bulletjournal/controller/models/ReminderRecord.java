package com.bulletjournal.controller.models;

import java.util.Objects;

public class ReminderRecord {
    String id;
    String timestamp; // "HH-mm"

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReminderRecord)) return false;
        ReminderRecord that = (ReminderRecord) o;
        return Objects.equals(this.id, that.id) &&
                Objects.equals(this.timestamp, that.timestamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, timestamp);
    }

}
