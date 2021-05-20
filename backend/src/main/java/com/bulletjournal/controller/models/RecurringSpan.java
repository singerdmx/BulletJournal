package com.bulletjournal.controller.models;

public class RecurringSpan {
    private int duration; // in min
    private String recurrenceRule;

    public RecurringSpan() {
    }

    public RecurringSpan(int duration, String recurrenceRule) {
        this.duration = duration;
        this.recurrenceRule = recurrenceRule;
    }

    public int getDuration() {
        return duration;
    }

    public void setDuration(int duration) {
        this.duration = duration;
    }

    public String getRecurrenceRule() {
        return recurrenceRule;
    }

    public void setRecurrenceRule(String recurrenceRule) {
        this.recurrenceRule = recurrenceRule;
    }
}
