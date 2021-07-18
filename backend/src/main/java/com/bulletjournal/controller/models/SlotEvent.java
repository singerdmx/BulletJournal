package com.bulletjournal.controller.models;

public class SlotEvent {
    private String eventName;
    private Long taskId;

    public SlotEvent(String eventName, Long taskId) {
        this.eventName = eventName;
        this.taskId = taskId;
    }

    public String getEventName() {
        return eventName;
    }

    public void setEventName(String eventName) {
        this.eventName = eventName;
    }

    public Long getTaskId() {
        return taskId;
    }

    public void setTaskId(Long taskId) {
        this.taskId = taskId;
    }
}
