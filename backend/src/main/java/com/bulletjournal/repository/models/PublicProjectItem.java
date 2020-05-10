package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.SharableLink;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "public_project_items")
public class PublicProjectItem extends AuditModel {

    @Id
    private String id;

    @Column
    private String username;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Task task;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "note_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Note note;

    @Column(name = "expiration_time")
    private Timestamp expirationTime;

    public PublicProjectItem() {
    }

    public PublicProjectItem(String id, String username) {
        this.id = id;
        this.username = username;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Timestamp getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Timestamp expirationTime) {
        this.expirationTime = expirationTime;
    }

    public boolean hasExpirationTime() {
        return this.expirationTime != null;
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

    public SharableLink toSharableLink() {
        return new SharableLink(this.getId(),
                this.hasExpirationTime() ? this.getExpirationTime().getTime() : null,
                this.getCreatedAt().getTime());
    }
}