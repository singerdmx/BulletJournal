package com.bulletjournal.templates.workflow.models;

import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.Selection;

import java.util.List;

/**
 * Operations can be done by regular user
 */
public interface Step extends AdminStep {

    String getName();

    List<Choice> getChoices();

    void select(Selection selection);

    void unselect(Selection selection);
}
