package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "sample_tasks", schema = "template")
public class SampleTask extends NamedModel {
    @Id
    @GeneratedValue(generator = "sample_task_generator")
    @SequenceGenerator(name = "sample_task_generator",
            sequenceName = "template.sample_task_sequence",
            initialValue = 100,
            allocationSize = 2)
    private Long id;

    @Column(name = "content")
    private String content;

    @Column(name = "metadata")
    private String metadata;

    @Column(name = "uid")
    private String uid;

    @ManyToMany(targetEntity = Step.class, fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinTable(name = "steps_sample_tasks", schema = "template",
            joinColumns = {
                    @JoinColumn(name = "sample_task_id", referencedColumnName = "id",
                            nullable = false, updatable = false)},
            inverseJoinColumns = {
                    @JoinColumn(name = "step_id", referencedColumnName = "id",
                            nullable = false, updatable = false)})
    private List<Step> steps = new ArrayList<>();

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getMetadata() {
        return metadata;
    }

    public void setMetadata(String metadata) {
        this.metadata = metadata;
    }

    public List<Step> getSteps() {
        return steps;
    }

    public void setSteps(List<Step> steps) {
        this.steps = steps;
    }

    public com.bulletjournal.templates.controller.model.SampleTask toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.SampleTask(
            id,
            getName(),
            content,
            metadata,
            steps.stream().map(Step::toPresentationModel).collect(Collectors.toList()),
            uid);
    }
}
