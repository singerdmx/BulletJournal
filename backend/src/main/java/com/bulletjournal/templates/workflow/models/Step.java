package com.bulletjournal.templates.workflow.models;

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
