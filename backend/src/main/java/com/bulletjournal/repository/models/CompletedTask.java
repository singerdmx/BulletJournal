package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "completed_tasks",
        indexes = {@Index(name = "completed_task_project_id_index", columnList = "project_id")})
public class CompletedTask extends TaskModel {

    @Id
    @GeneratedValue(generator = "completed_task_generator")
    @SequenceGenerator(
            name = "completed_task_generator",
            sequenceName = "completed_task_sequence",
            initialValue = 100
    )
    private Long id;

    public CompletedTask() {
    }

    public CompletedTask(Task task) {
        this.setAssignedTo(task.getAssignedTo());
        this.setDueDate(task.getDueDate());
        this.setDueTime(task.getDueTime());
        this.setName(task.getName());
        this.setReminderBeforeTask(task.getReminderBeforeTask());
        this.setReminderDate(task.getReminderDate());
        this.setReminderTime(task.getReminderTime());
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
