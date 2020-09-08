package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToMany(targetEntity = Step.class, mappedBy = "sampleTasks", fetch = FetchType.LAZY)
    private List<Step> steps = new ArrayList<>();

    @Override
    public Long getId() {
        return null;
    }

    public void setId(Long id) {
        this.id = id;
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
}
