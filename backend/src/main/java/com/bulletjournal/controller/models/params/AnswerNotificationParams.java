package com.bulletjournal.controller.models.params;

public class AnswerNotificationParams {

    private String action;

    public AnswerNotificationParams() {
    }

    public AnswerNotificationParams(String action) {
        this.action = action;
    }

    public String getAction() {
        return action;
    }

    public void setAction(String action) {
        this.action = action;
    }
}
