package com.bulletjournal.controller.models;

public class ProjectDetails extends Project {

    private ProjectSetting projectSetting;

    public ProjectDetails() {
    }

    public ProjectDetails(Project project) {
        super(project.getId(), project.getName(), project.getOwner(),
                project.getProjectType(), project.getGroup(), project.getDescription(),
                project.isShared(), project.getSubProjects());
    }

    public ProjectSetting getProjectSetting() {
        return projectSetting;
    }

    public void setProjectSetting(ProjectSetting projectSetting) {
        this.projectSetting = projectSetting;
    }
}
