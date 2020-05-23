package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.sql.Timestamp;

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

    @Column(length = 5000)
    private String channel;

    @Column(length = 300)
    private String token;

    @Column(length = 100)
    private String owner;

    @Column(nullable = false)
    private Timestamp expiration;

    public GoogleCalendarProject() {
    }

    public GoogleCalendarProject(String id, Project project, String channelId, String channel,
                                 String token, String owner, Timestamp expiration) {
        this.id = id;
        this.project = project;
        this.channelId = channelId;
        this.channel = channel;
        this.token = token;
        this.owner = owner;
        this.expiration = expiration;
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

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getChannel() {
        return channel;
    }

    public void setChannel(String channel) {
        this.channel = channel;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Timestamp getExpiration() {
        return expiration;
    }

    public void setExpiration(Timestamp expiration) {
        this.expiration = expiration;
    }

    @Override
    public String toString() {
        return "GoogleCalendarProject{" +
                "id='" + id + '\'' +
                ", project=" + project +
                ", channelId='" + channelId + '\'' +
                ", channel='" + channel + '\'' +
                ", token='" + token + '\'' +
                ", owner='" + owner + '\'' +
                ", expiration='" + expiration + '\'' +
                '}';
    }
}