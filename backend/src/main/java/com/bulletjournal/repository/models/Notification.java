package com.bulletjournal.repository.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

@Entity
@Table(name = "notifications",
        indexes = {@Index(name = "notification_time_index", columnList = "owner,updated_at")})
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
    private String owner;

    @Lob
    @Column
    private String content;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100)
    private String targetUser;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
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

    public com.bulletjournal.controller.models.Notification toPresentationModel() {
        return new com.bulletjournal.controller.models.Notification(
                this.getContent(), this.getUpdatedAt().getTime(), this.getTargetUser());
    }
}
