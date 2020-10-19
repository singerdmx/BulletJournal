package com.bulletjournal.notifications;

public class SampleTaskChange {
    // Use "pending" to determine it is created or modified
    private long id;

    public SampleTaskChange() {
    }

    public SampleTaskChange(long id) {
        this.id = id;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }


    @Override
    public String toString() {
        return "SampleTaskChange{" +
                "id=" + id +
                '}';
    }
}
