package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.AuditModel;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

/**
 * Choice <-> Selection is `one to many` relationship
 * One choice has multiple selections
 * One selection can only belong to one choice
 */
@Entity
@Table(name = "selections", schema = "template")
public class Selection extends AuditModel {

    @Id
    @GeneratedValue(generator = "selection_generator")
    @SequenceGenerator(name = "selection_generator",
            sequenceName = "template.selection_sequence",
            initialValue = 100,
            allocationSize = 2)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "choice_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Choice choice;

    @Column(name = "icon")
    private String icon;

    @Column(name = "text", nullable = false)
    private String text;

    public Selection() {
    }

    public Selection(Choice choice, String icon, String text) {
        this.choice = choice;
        this.icon = icon;
        this.text = text;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Choice getChoice() {
        return choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }
}
