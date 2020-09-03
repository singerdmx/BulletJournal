package com.bulletjournal.templates.controller.model;


public enum RuleType {
    CATEGORY_RULE(0),
    STEP_RULE(1);

    private final int value;

    RuleType(int value) {
        this.value = value;
    }

    public int getValue() {
        return this.value;
    }
}