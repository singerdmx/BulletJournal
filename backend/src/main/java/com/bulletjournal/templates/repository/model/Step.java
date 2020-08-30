package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.NamedModel;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "steps", schema = "template")
public class Step extends NamedModel {

    @Id
    @GeneratedValue(generator = "step_generator")
    @SequenceGenerator(name = "step_generator", sequenceName = "template.step_sequence", initialValue = 8000, allocationSize = 10)
    private Long id;

    @Column(nullable = false)
    private String name;

    @ManyToMany(targetEntity = Choice.class, mappedBy = "steps", fetch = FetchType.LAZY)
    private List<Choice> choices = new ArrayList<>();

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }

    @Override
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
