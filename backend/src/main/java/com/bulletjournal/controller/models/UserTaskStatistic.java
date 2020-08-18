package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserTaskStatistic {
    private User user;
    private int completed = 0;
    private int uncompleted = 0;

    public UserTaskStatistic() {
    }

    public UserTaskStatistic(User user) {
        this.user = user;
    }

    public UserTaskStatistic(User user, int completed, int uncompleted) {
        this.user = user;
        this.completed = completed;
        this.uncompleted = uncompleted;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public int getCompleted() {
        return completed;
    }

    public void setCompleted(int completed) {
        this.completed = completed;
    }

    public void incrementCompleted() {
        this.completed += 1;
    }

    public int getUncompleted() {
        return uncompleted;
    }

    public void setUncompleted(int uncompleted) {
        this.uncompleted = uncompleted;
    }

    public void incrementUncompleted() {
        this.uncompleted += 1;
    }
}
