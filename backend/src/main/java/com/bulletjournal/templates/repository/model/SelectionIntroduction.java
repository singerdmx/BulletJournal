package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.AuditModel;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "selection_introduction", schema = "template")
public class SelectionIntroduction extends AuditModel {
    @Id
    @GeneratedValue(generator = "selection_introduction_sequence_generator")
    @SequenceGenerator(name = "selection_introduction_sequence_generator", sequenceName = "template.selection_introduction_sequence", initialValue = 800, allocationSize = 2)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "selection_id", referencedColumnName = "id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Selection selection;

    @Column
    private String imageLink;

    @Column
    private String description;

    @Column
    private String title;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Selection getSelection() {
        return selection;
    }

    public void setSelection(Selection selection) {
        this.selection = selection;
    }

    public String getImageLink() {
        return imageLink;
    }

    public void setImageLink(String imageLink) {
        this.imageLink = imageLink;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public com.bulletjournal.templates.controller.model.SelectionIntroduction toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.SelectionIntroduction(selection.toPresentationModel(), imageLink, description, title);
    }

}
