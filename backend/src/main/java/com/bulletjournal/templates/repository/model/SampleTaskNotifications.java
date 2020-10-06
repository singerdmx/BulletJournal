package com.bulletjournal.templates.repository.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "sample_task_notifications", schema = "template")
public class SampleTaskNotifications {
    @Id
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "notifications", nullable = false)
    private String notifications;
}
