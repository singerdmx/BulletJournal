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
        if (StringUtils.isNotBlank(selectionCombo)) {
            selectionCombo = StringUtils.join(convert(selectionCombo), ",");
        }
        this.selectionCombo = selectionCombo;
    }

    public List<Long> getSelectionIds() {
        return convert(this.selectionCombo);
    }

    public List<Long> getSampleTaskIds() {
        return convert(this.taskIds);
    }

    private List<Long> convert(String numArray) {
        if (StringUtils.isBlank(numArray)) {
            return Collections.emptyList();
        }

        return Arrays.stream(numArray.split(","))
                .map(t -> Long.parseLong(t)).sorted().collect(Collectors.toList());
    }
}
