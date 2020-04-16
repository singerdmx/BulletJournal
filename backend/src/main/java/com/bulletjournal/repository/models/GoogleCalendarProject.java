package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "google_calendar_projects",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"channel_id"})
        })
public class GoogleCalendarProject extends AuditModel {
    @Id
    private String id; // calendarId

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

    @Column(name = "channel_id")
    private String channelId;

    public GoogleCalendarProject() {
    }

    public GoogleCalendarProject(String id, Project project, String channelId) {
        this.id = id;
        this.project = project;
        this.channelId = channelId;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getChannelId() {
        return channelId;
    }

    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }
}