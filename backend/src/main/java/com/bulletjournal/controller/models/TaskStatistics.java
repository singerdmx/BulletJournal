package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;

import java.util.ArrayList;
import java.util.List;

@JsonInclude(JsonInclude.Include.NON_NULL)
public class TaskStatistics {

    private int completed;
    private int uncompleted;
    private List<UserTaskStatistic> userTaskStatistics = new ArrayList<>();

    public TaskStatistics() {
    }

    public TaskStatistics(int completed, int uncompleted, List<UserTaskStatistic> userTaskStatistics) {
        this.completed = completed;
        this.uncompleted = uncompleted;
        this.userTaskStatistics = userTaskStatistics;
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

    public List<UserTaskStatistic> getUserTaskStatistics() {
        return userTaskStatistics;
    }

    public void setUserTaskStatistics(List<UserTaskStatistic> userTaskStatistics) {
        this.userTaskStatistics = userTaskStatistics;
    }
}
