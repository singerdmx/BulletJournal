package com.bulletjournal.templates.workflow.engine;

import com.bulletjournal.templates.workflow.models.SelectionCombo;
import com.bulletjournal.templates.workflow.models.Step;

import java.util.Collections;
import java.util.List;

public class RuleEngine {

    public static List<Step> getNextSteps(Step step, SelectionCombo selections) {
        // rule = db data + code logic
        // Use step + its selections to determine next steps
        return Collections.emptyList();
    }
}
