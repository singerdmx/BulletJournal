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
            sequenceName = "notification_sequence",
            initialValue = 100
    )
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false)
    private String originator;

    @NotBlank
    @Column(nullable = false)
    private String title;

    @Column
    private String content;

    @Column(name = "content_id")
    private Long contentId;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(name = "target_user", length = 100, nullable = false)
    private String targetUser;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false)
    private String type;

    @Column
    private String actions;

    public Notification() {
    }

    public Notification(
            String originator, String title, String content, String targetUser,
            String type, Long contentId) {
        this.originator = originator;
        this.title = title;
        this.content = content;
        this.targetUser = targetUser;
        this.type = type;
        this.contentId = contentId;
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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getContentId() {
        return contentId;
    }

    public void setContentId(Long contentId) {
        this.contentId = contentId;
    }

    public String getActions() {
        return actions;
    }

    public void setActions(String actions) {
        this.actions = actions;
    }

    public com.bulletjournal.controller.models.Notification toPresentationModel() {
        return new com.bulletjournal.controller.models.Notification(
                this.getId(), this.getTitle(), this.getContent(),
                this.getUpdatedAt().getTime(), this.getType());
    }
}
