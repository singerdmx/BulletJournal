package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserTaskStatistic {
    private String name;
    private int completed;
    private int uncompleted;

    public UserTaskStatistic() {
    }

    public UserTaskStatistic(String name, int completed, int uncompleted) {
        this.name = name;
        this.completed = completed;
        this.uncompleted = uncompleted;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCompleted() {
        return completed;
    }

    public void setCompleted(int completed) {
        this.completed = completed;
    }

    public int getUncompleted() {
        return uncompleted;
    }

    public void setUncompleted(int uncompleted) {
        this.uncompleted = uncompleted;
    }
}
