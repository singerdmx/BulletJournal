package com.bulletjournal.notifications;

import com.bulletjournal.templates.controller.model.RemoveUserSampleTasksParams;
import com.bulletjournal.templates.controller.model.SampleTask;

import java.util.List;

public class ImportSampleTasksEvent {
    private RemoveUserSampleTasksParams importTasksParams;
    private String requester;
    private List<SampleTask> sampleTasks;
    private List<com.bulletjournal.templates.repository.model.SampleTask> repoSampleTasks;

    public ImportSampleTasksEvent(
            RemoveUserSampleTasksParams importTasksParams,
            String requester,
            List<SampleTask> sampleTasks,
            List<com.bulletjournal.templates.repository.model.SampleTask> repoSampleTasks) {
        this.importTasksParams = importTasksParams;
        this.requester = requester;
        this.sampleTasks = sampleTasks;
        this.repoSampleTasks = repoSampleTasks;
    }

    public RemoveUserSampleTasksParams getImportTasksParams() {
        return importTasksParams;
    }

    public void setImportTasksParams(RemoveUserSampleTasksParams importTasksParams) {
        this.importTasksParams = importTasksParams;
    }

    public String getRequester() {
        return requester;
    }

    public void setRequester(String requester) {
        this.requester = requester;
    }

    public List<SampleTask> getSampleTasks() {
        return sampleTasks;
    }

    public void setSampleTasks(List<SampleTask> sampleTasks) {
        this.sampleTasks = sampleTasks;
    }

    public List<com.bulletjournal.templates.repository.model.SampleTask> getRepoSampleTasks() {
        return repoSampleTasks;
    }

    public void setRepoSampleTasks(List<com.bulletjournal.templates.repository.model.SampleTask> repoSampleTasks) {
        this.repoSampleTasks = repoSampleTasks;
    }
}
