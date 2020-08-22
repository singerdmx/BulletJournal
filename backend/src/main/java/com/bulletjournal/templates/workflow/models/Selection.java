package com.bulletjournal.templates.workflow.models;

/**
 * Choice <-> Selection is `one to many` relationship
 * One choice has multiple selections
 * One selection can only belong to one choice
 */
public class Selection {
    private Choice choice;
    private String icon;
    private String text;

    public Selection() {
    }

    public Selection(Choice choice, String icon, String text) {
        this.choice = choice;
        this.icon = icon;
        this.text = text;
    }

    public String getIcon() {
        return icon;
    }

    public void setIcon(String icon) {
        this.icon = icon;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Choice getChoice() {
        return choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }
}
