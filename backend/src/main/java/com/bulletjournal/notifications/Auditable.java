package com.bulletjournal.notifications;

import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.ProjectItemModel;

public class Auditable {
    private Project project;
    private ProjectItemModel projectItem;
    private String activity;
    private String originator;

    public Auditable(Project project, ProjectItemModel projectItem, String activity, String originator) {
        this.project = project;
        this.projectItem = projectItem;
        this.activity = activity;
        this.originator = originator;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ProjectItemModel getProjectItem() {
        return projectItem;
    }

    public void setProjectItem(ProjectItemModel projectItem) {
        this.projectItem = projectItem;
    }

    public String getActivity() {
        return activity;
    }

    public void setActivity(String activity) {
        this.activity = activity;
    }

    public String getOriginator() {
        return originator;
    }

    public void setOriginator(String originator) {
        this.originator = originator;
    }
}
