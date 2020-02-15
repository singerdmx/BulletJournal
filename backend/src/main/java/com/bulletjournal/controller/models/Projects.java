package com.bulletjournal.controller.models;

import java.util.ArrayList;
import java.util.List;

public class Projects {

    List<Project> owned = new ArrayList<>();

    List<Project> shared = new ArrayList<>();

    public List<Project> getOwned() {
        return owned;
    }

    public void setOwned(List<Project> owned) {
        this.owned = owned;
    }

    public List<Project> getShared() {
        return shared;
    }

    public void setShared(List<Project> shared) {
        this.shared = shared;
    }
}
