package com.bulletjournal.templates.controller.model;

public class ChoiceMetadata {

    private String keyword;

    private Choice choice;

    public ChoiceMetadata() {
    }

    public ChoiceMetadata(String keyword, Choice choice) {
        this.keyword = keyword;
        this.choice = choice;
    }



    public String getKeyword() {
        return keyword;
    }

    public void setKeyword(String keyword) {
        this.keyword = keyword;
    }

    public Choice getChoice() {
        return choice;
    }

    public void setChoice(Choice choice) {
        this.choice = choice;
    }
}
