package com.bulletjournal.controller.models;

public class UpdateSharedProjectsOrderParams {

    // owner names of projects for ordering
    private String[] projectOwners;

    public String[] getProjectOwners() {
        return projectOwners;
    }

    public void setProjectOwners(String[] projectOwners) {
        this.projectOwners = projectOwners;
    }

    public boolean hasProjectOwners() {
        return projectOwners != null;
    }
}
