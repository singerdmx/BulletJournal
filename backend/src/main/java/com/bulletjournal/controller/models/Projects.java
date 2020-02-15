package com.bulletjournal.controller.models;

import java.util.ArrayList;
import java.util.List;

public class Projects {

    List<Project> owned = new ArrayList<>();

    List<ProjectsWithOwner> shared;

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
