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
}
