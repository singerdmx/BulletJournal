package com.bulletjournal.templates.repository.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "category_rules", schema = "template")
public class CategoryRule extends Rule {

    @Id
    @GeneratedValue(generator = "category_rule_generator")
    @SequenceGenerator(name = "category_rule_generator", sequenceName = "template.category_rule_sequence", initialValue = 100, allocationSize = 2)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "category_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Category category;

    public CategoryRule() {
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    @Override
    public Long getId() {
        return id;
    }

    public com.bulletjournal.templates.controller.model.Rule toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.Rule(id, getName(), getPriority(), getRuleExpression(),
                new com.bulletjournal.templates.controller.model.Category(getId(), getName()), null,
                new com.bulletjournal.templates.controller.model.Step(getConnectedStep().getId(), getConnectedStep().getName()));
    }
}
