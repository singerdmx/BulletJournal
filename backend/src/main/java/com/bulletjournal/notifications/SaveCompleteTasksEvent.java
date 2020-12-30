package com.bulletjournal.notifications;

import com.bulletjournal.repository.models.CompletedTask;

import java.util.List;

public class SaveCompleteTasksEvent {
    private List<CompletedTask> completedTaskList;

    public SaveCompleteTasksEvent(List<CompletedTask> completedTaskList) {
        this.completedTaskList = completedTaskList;
    }

    public List<CompletedTask> getCompletedTaskList() {
        return completedTaskList;
    }

    public void setCompletedTaskList(List<CompletedTask> completedTaskList) {
        this.completedTaskList = completedTaskList;
    }
}

