package com.bulletjournal.repository.models;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.TaskStatus;
import com.bulletjournal.repository.auditing.TaskEntityListeners;
import com.bulletjournal.templates.repository.model.SampleTask;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.util.List;

/**
 * This class is for ProjectType.TODO
 */
@Entity
@Table(name = "tasks", uniqueConstraints = { @UniqueConstraint(columnNames = { "google_calendar_event_id" }) })
@EntityListeners(value = {TaskEntityListeners.class})
public class Task extends TaskModel {
    @Id
    @GeneratedValue(generator = "task_generator")
    @SequenceGenerator(name = "task_generator", sequenceName = "task_sequence", initialValue = 100)
    private Long id;

    @Column
    private Integer status;

    public SampleTask getSampleTask() {
        return sampleTask;
    }

    public void setSampleTask(SampleTask sampleTask) {
        this.sampleTask = sampleTask;
    }

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sample_task_id", referencedColumnName = "id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private SampleTask sampleTask;

    @Column(name = "completed_slots", columnDefinition = "TEXT")
    private String completedSlots;

    @Column(length = 10485760, name = "contents_order")
    private String contentsOrder;

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TASK;
    }

    public String getCompletedSlots() {
        return completedSlots;
    }

    public void setCompletedSlots(String completedSlots) {
        this.completedSlots = completedSlots;
    }

    public Integer getStatus() {
        return this.status;
    }

    public int getIntStatus() {
        if (this.status == null) {
            return Integer.MAX_VALUE;
        }
        return this.status;
    }

    public void setStatus(Integer status) {
        this.status = status;
    }

    @Override
    public String getContentsOrder() {
        return contentsOrder;
    }

    @Override
    public void setContentsOrder(String contentsOrder) {
        this.contentsOrder = contentsOrder;
    }

    @Override
    public com.bulletjournal.controller.models.Task toPresentationModel(AuthorizationService authorizationService) {
        com.bulletjournal.controller.models.Task task = super.toPresentationModel(authorizationService);
        if (this.status != null) {
            task.setStatus(TaskStatus.getType(this.status));
        }
        return task;
    }

    @Override
    public com.bulletjournal.controller.models.Task toPresentationModel(List<Label> labels, AuthorizationService authorizationService) {

        com.bulletjournal.controller.models.Task task = super.toPresentationModel(labels, authorizationService);
        if (this.status != null) {
            task.setStatus(TaskStatus.getType(this.status));
        }
        return task;
    }

}
