package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import com.bulletjournal.contents.ContentAction;

import java.sql.Timestamp;

@Entity
@Table(name = "auditables")
public class Auditable extends AuditModel {
    @Id
    @GeneratedValue(generator = "auditable_generator")
    @SequenceGenerator(name = "auditable_generator", sequenceName = "auditable_sequence", initialValue = 200)
    private Long id;

    @Column(name = "action", nullable = false, updatable = false)
    private ContentAction action;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

    @Column(name = "activity", nullable = false, updatable = false)
    private String activity;

    @Column(name = "activity_time", nullable = false, updatable = false)
    private Timestamp activityTime;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false, updatable = false)
    private String originator;

    public Auditable(Project project, String activity, String originator) {
        this.project = project;
        this.activity = activity;
        this.originator = originator;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
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

    public Timestamp getActivityTime() {
        return activityTime;
    }

    public void setActivityTime(Timestamp activityTime) {
        this.activityTime = activityTime;
    }

    public ContentAction getAction() {
        return action;
    }

    public void setAction(ContentAction action) {
        this.action = action;
    }
}
