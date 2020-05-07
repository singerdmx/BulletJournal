package com.bulletjournal.notifications;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Project;

public class Auditable {
    private Project project;
    private ContentType contentType;
    // projectItem may be deleted already
    private Long projectItemId;
    private String activity;
    private String originator;

    public Auditable(
            Project project, String activity, String originator, ContentType contentType, Long projectItemId) {
        this.project = project;
        this.contentType = contentType;
        this.activity = activity;
        this.originator = originator;
        this.projectItemId = projectItemId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public ContentType getContentType() {
        return contentType;
    }

    public void setContentType(ContentType contentType) {
        this.contentType = contentType;
    }

    public Long getProjectItemId() {
        return projectItemId;
    }

    public void setProjectItemId(Long projectItemId) {
        this.projectItemId = projectItemId;
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

    public com.bulletjournal.repository.models.Auditable toRepositoryAuditable() {
        return new com.bulletjournal.repository.models.Auditable(this.project, this.activity, this.originator);
    }
}
