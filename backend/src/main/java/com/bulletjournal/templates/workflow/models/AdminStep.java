package com.bulletjournal.templates.workflow.models;

import com.bulletjournal.templates.repository.model.Choice;

/**
 * Operations can be done by Admin
 */
public interface AdminStep {

    void addChoice(Choice choice);

    void removeChoice(Choice choice);

    void setName(String name);
}
