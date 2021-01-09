package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Projects {

    @NotNull
    private List<Project> owned = new ArrayList<>();

    @NotNull
    private List<ProjectsWithOwner> shared = new ArrayList<>();

    private Map<Project, ProjectSetting> settings = new HashMap<>();

    public Map<Project, ProjectSetting> getSettings() {
        return settings;
    }

    public void setSettings(Map<Project, ProjectSetting> settings) {
        this.settings = settings;
    }

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
