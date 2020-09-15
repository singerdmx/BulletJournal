package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateChoiceParams {
    @NotNull
    private String name;

    @NotNull
    private boolean multiple;

    @NotNull
    private boolean instructionIncluded;

    public CreateChoiceParams(@NotNull String name, @NotNull boolean multiple, @NotNull boolean instructionIncluded) {
        this.name = name;
        this.multiple = multiple;
        this.instructionIncluded = instructionIncluded;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }

    public boolean isInstructionIncluded() {
        return instructionIncluded;
    }

    public void setInstructionIncluded(boolean instructionIncluded) {
        this.instructionIncluded = instructionIncluded;
    }
}
