package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;
import java.util.List;

public class RemoveUserSampleTasksParams {
    @NotNull
    private List<Long> sampleTasks;

    @NotNull
    private Long projectId;
    @NotNull
    private List<String> assignees;
    @NotNull
    private Integer reminderBefore;
    @NotNull
    private List<Long> labels;
    private String startDate;
    private String timezone;

    public RemoveUserSampleTasksParams() {
    }

    public RemoveUserSampleTasksParams(@NotNull List<Long> sampleTasks) {
        this.sampleTasks = sampleTasks;
    }

    public List<Long> getSampleTasks() {
        return sampleTasks;
    }

    public void setSampleTasks(List<Long> sampleTasks) {
        this.sampleTasks = sampleTasks;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<String> getAssignees() {
        return assignees;
    }

    public void setAssignees(List<String> assignees) {
        this.assignees = assignees;
    }

    public Integer getReminderBefore() {
        return reminderBefore;
    }

    public void setReminderBefore(Integer reminderBefore) {
        this.reminderBefore = reminderBefore;
    }

    public List<Long> getLabels() {
        return labels;
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}
