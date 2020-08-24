package com.bulletjournal.templates.workflow.models;

/**
 * Operations can be done by Admin
 */
public interface AdminStep {

    void addChoice(Choice choice);

    void removeChoice(Choice choice);

    void setName(String name);
}
