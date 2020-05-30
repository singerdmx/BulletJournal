package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class Projects {

    @NotNull
    private List<Project> owned = new ArrayList<>();

    @NotNull
    private List<ProjectsWithOwner> shared = new ArrayList<>();

    public static Projects addOwnerAvatar(Projects projects, UserClient userClient) {
        projects.owned.forEach(p -> Project.addOwnerAvatar(p, userClient));
        ProjectsWithOwner.addOwnerAvatar(projects.shared, userClient);
        return projects;
    }

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
