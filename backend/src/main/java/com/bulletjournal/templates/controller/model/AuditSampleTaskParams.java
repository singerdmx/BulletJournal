package com.bulletjournal.templates.controller.model;

import java.util.List;

public class AuditSampleTaskParams {
    private Long choiceId;
    private List<Long> selections;

    public AuditSampleTaskParams() {
    }

    public AuditSampleTaskParams(Long choiceId, List<Long> selections) {
        this.choiceId = choiceId;
        this.selections = selections;
    }

    public Long getChoiceId() {
        return choiceId;
    }

    public void setChoiceId(Long choiceId) {
        this.choiceId = choiceId;
    }

    public List<Long> getSelections() {
        return selections;
    }

    public void setSelections(List<Long> selections) {
        this.selections = selections;
    }
}
