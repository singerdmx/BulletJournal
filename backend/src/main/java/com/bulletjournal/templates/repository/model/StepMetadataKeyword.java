package com.bulletjournal.templates.repository.model;

import com.bulletjournal.repository.models.AuditModel;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "step_metadata_keywords", schema = "template")
public class StepMetadataKeyword extends AuditModel {

    @Id
    private String keyword;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Step step;

    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public com.bulletjournal.templates.controller.model.StepMetadata toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.StepMetadata(keyword, step.toPresentationModel());
    }
}
