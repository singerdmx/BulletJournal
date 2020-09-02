package com.bulletjournal.templates.controller.model;

public class Selection {
    private Long id;

    private Choice choice;

    private String icon;

    private String text;

    public Selection() {
    }

    public Selection(Long id, Choice choice, String icon, String text) {
        this.id = id;
        this.choice = choice;
        this.icon = icon;
        this.text = text;
    }

    public Selection(Long id, String icon, String text) {
        this.id = id;
        this.icon = icon;
        this.text = text;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Choice getChoice() {
        return choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
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
}
