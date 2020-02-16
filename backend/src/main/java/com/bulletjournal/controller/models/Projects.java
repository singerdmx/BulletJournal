package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class Projects {

    @NotNull
    private List<Project> owned = new ArrayList<>();

    @NotNull
    private List<ProjectsWithOwner> shared = new ArrayList<>();

    public List<Project> getOwned() {
        return owned;
    }

    public void setOwned(List<Project> owned) {
        this.owned = owned;
    }

    public List<ProjectsWithOwner> getShared() {
        return shared;
    }

    public void setShared(List<ProjectsWithOwner> shared) {
        this.shared = shared;
    }
}
