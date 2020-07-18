package com.bulletjournal.daemon.models;

import java.util.Objects;

public class ReminderRecord {
    private long id;
    private long timeStampSecond; // second

    public ReminderRecord(long id, long timeStampSecond) {
        this.id = id;
        this.timeStampSecond = timeStampSecond;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getTimeStampSecond() {
        return timeStampSecond;
    }

    public void setTimeStampSecond(long timeStampSecond) {
        this.timeStampSecond = timeStampSecond;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReminderRecord)) return false;
        ReminderRecord that = (ReminderRecord) o;
        return Objects.equals(this.id, that.id) &&
                Objects.equals(this.timeStampSecond, that.timeStampSecond);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, timeStampSecond);
    }

}
