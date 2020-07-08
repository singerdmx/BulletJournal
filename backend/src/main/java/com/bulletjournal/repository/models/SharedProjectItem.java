package com.bulletjournal.repository.models;

import com.bulletjournal.repository.utils.LongArrayType;
import org.hibernate.annotations.*;

import javax.persistence.*;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@TypeDefs({
        @TypeDef(
                name = "long-array",
                typeClass = LongArrayType.class
        ),
})
@Entity
@Table(name = "shared_project_items")
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
    @Column
    private String requester;

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

    @Type(type = "long-array")
    @Column(
            name = "labels",
            columnDefinition = "bigint[]"
    )
    private Long[] labels;

    public SharedProjectItem() {
    }

    public SharedProjectItem(String requester, String username) {
        this.requester = requester;
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

    public String getRequester() {
        return requester;
    }

    public void setRequester(String requester) {
        this.requester = requester;
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

    public List<Long> getLabels() {
        if (this.labels == null) {
            return Collections.emptyList();
        }
        return Arrays.asList(this.labels);
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels == null ? null : labels.toArray(new Long[0]);
    }
}