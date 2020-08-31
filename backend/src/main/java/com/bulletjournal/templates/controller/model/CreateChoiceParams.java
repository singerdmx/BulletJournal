package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;

public class CreateChoiceParams {
    @NotNull
    private String name;

    @NotNull
    private boolean multiple;

    public CreateChoiceParams(@NotNull String name, @NotNull boolean multiple) {
        this.name = name;
        this.multiple = multiple;
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
}
