package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "shared_project_items",
        indexes = {@Index(name = "shared_project_items_username_index", columnList = "username"),
                @Index(name = "shared_project_items_task_index", columnList = "task_id"),
                @Index(name = "shared_project_items_note_index", columnList = "note_id")})
public class SharedProjectItem extends AuditModel {

    @Id
    @GeneratedValue(generator = "shared_project_item_generator")
    @SequenceGenerator(
            name = "shared_project_item_generator",
            sequenceName = "shared_project_item_sequence",
            initialValue = 100
    )
    private Long id;

    @Column
    private String username;
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "task_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Task task;
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "note_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Note note;
    @ManyToOne(fetch = FetchType.LAZY, optional = true)
    @JoinColumn(name = "transaction_id", nullable = true)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Transaction transaction;

    public SharedProjectItem() {
    }

    public SharedProjectItem(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public boolean hasTask() {
        return this.task != null;
    }

    public Note getNote() {
        return note;
    }

    public void setNote(Note note) {
        this.note = note;
    }

    public boolean hasNote() {
        return this.note != null;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public boolean hasTransaction() {
        return this.transaction != null;
    }
}