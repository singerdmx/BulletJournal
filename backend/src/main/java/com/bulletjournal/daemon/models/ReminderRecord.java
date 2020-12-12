package com.bulletjournal.daemon.models;

import java.util.Objects;

public class ReminderRecord {
    private long id;
    private long timestampMilli;

    public ReminderRecord(long id, long timestampMilli) {
        this.id = id;
        this.timestampMilli = timestampMilli;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getTimestamp() {
        return timestampMilli;
    }

    public void setTimestamp(long timestamp) {
        this.timestampMilli = timestamp;
    }

    public long getTimestampSecond() {
        return this.timestampMilli / 1000;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReminderRecord)) return false;
        ReminderRecord that = (ReminderRecord) o;
        return Objects.equals(this.id, that.id) &&
                Objects.equals(this.timestampMilli, that.timestampMilli);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, timestampMilli);
    }

    @Override
    public String toString() {
        return "ReminderRecord={id:" + this.id
                + ",timestampSecond:" + this.getTimestampSecond() + "}";
    }

    public ReminderRecord clone() {
        return new ReminderRecord(this.id, this.timestampMilli);
    }
}
