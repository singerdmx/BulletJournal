package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.AuditModel;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "choice_metadata_keywords", schema = "template")
public class ChoiceMetadataKeyword extends AuditModel {

    @Id
    private String keyword;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "choice_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Choice choice;

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Choice getChoice() {
        return choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }

    public com.bulletjournal.templates.controller.model.ChoiceMetadata toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.ChoiceMetadata(keyword, choice.toPresentationModel());
    }
}
