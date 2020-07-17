package com.bulletjournal.daemon.models;

import java.util.Objects;

public class ReminderRecord {
    private long id;
    private long reminderTimeStamp;

    public ReminderRecord(long id, long reminderTimeStamp) {
        this.id = id;
        this.reminderTimeStamp = reminderTimeStamp;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getReminderTimeStamp() {
        return reminderTimeStamp;
    }

    public void setReminderTimeStamp(long reminderTimeStamp) {
        this.reminderTimeStamp = reminderTimeStamp;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ReminderRecord)) return false;
        ReminderRecord that = (ReminderRecord) o;
        return Objects.equals(this.id, that.id) &&
                Objects.equals(this.reminderTimeStamp, that.reminderTimeStamp);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, reminderTimeStamp);
    }

}
