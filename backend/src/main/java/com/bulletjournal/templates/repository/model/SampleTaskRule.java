package com.bulletjournal.templates.repository.model;

import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.io.Serializable;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Entity
@Table(name = "sample_task_rules", schema = "template")
@IdClass(SampleTaskRuleId.class)
public class SampleTaskRule implements Serializable {
    @Id
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "step_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Step step;

    @Id
    @Column(name = "selection_combo", nullable = false)
    private String selectionCombo;

    @Column(name = "task_ids", nullable = false)
    private String taskIds;

    public String getTaskIds() {
        return taskIds;
    }

    public void setTaskIds(String taskIds) {
        this.taskIds = taskIds;
    }

    public Step getStep() {
        return step;
    }

    public void setStep(Step step) {
        this.step = step;
    }

    public String getSelectionCombo() {
        return selectionCombo;
    }

    public void setSelectionCombo(String selectionCombo) {
        this.selectionCombo = selectionCombo;
    }

    public List<Long> getSelectionIds() {
        if (StringUtils.isBlank(this.selectionCombo)) {
            return Collections.emptyList();
        }

        return Arrays.stream(this.selectionCombo.split(","))
                .map(s -> Long.parseLong(s)).collect(Collectors.toList());
    }

    public List<Long> getSampleTaskIds() {
        if (StringUtils.isBlank(this.taskIds)) {
            return Collections.emptyList();
        }

        return Arrays.stream(this.taskIds.split(","))
                .map(t -> Long.parseLong(t)).collect(Collectors.toList());
    }
}
