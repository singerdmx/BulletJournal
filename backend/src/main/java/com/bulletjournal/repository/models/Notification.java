package com.bulletjournal.repository.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "notifications",
        indexes = {@Index(name = "notification_time_index", columnList = "target_user,updated_at")})
public class Notification extends AuditModel {

    @Id
    @GeneratedValue(generator = "notification_generator")
    @SequenceGenerator(
            name = "notification_generator",
            sequenceName = "notification_sequence"
    )
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100)
    private String originator;

    @NotBlank
    @Column
    private String title;

    @Column
    private String content;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(name = "target_user", length = 100)
    private String targetUser;

    public Notification() {
    }

    public Notification(String originator, String title, String content, String targetUser) {
        this.originator = originator;
        this.title = title;
        this.content = content;
        this.targetUser = targetUser;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOriginator() {
        return originator;
    }

    public void setOriginator(String owner) {
        this.originator = owner;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getTargetUser() {
        return targetUser;
    }

    public void setTargetUser(String targetUser) {
        this.targetUser = targetUser;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public com.bulletjournal.controller.models.Notification toPresentationModel() {
        return new com.bulletjournal.controller.models.Notification(
                this.getTitle(), this.getContent(), this.getUpdatedAt().getTime(), this.getTargetUser());
    }
}
