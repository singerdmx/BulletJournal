package com.bulletjournal.templates.repository.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sample_task_notifications", schema = "template")
public class SampleTaskNotification {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "notifications", nullable = false)
    private String notifications;

    public SampleTaskNotification() {
    }

    public SampleTaskNotification(Long id, String notifications) {
        this.id = id;
        this.notifications = notifications;
    }

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }

    public String getNotifications() {
        return notifications;
    }

    public void setNotifications(String notifications) {
        this.notifications = notifications;
    }

}
