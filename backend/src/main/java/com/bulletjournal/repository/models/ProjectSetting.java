package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "project_settings")
public class ProjectSetting {
    @Id
    @Column(name = "project_id")
    private Long id;

    @OneToOne(cascade = CascadeType.ALL)
    @MapsId
    @JoinColumn(name = "project_id")
    private Project project;

    @Column
    private String color;

    @Column(name = "auto_delete")
    private boolean autoDelete;

    @Column(name = "allow_edit_contents")
    private boolean allowEditContents;

    @Column(name = "allow_edit_proj_items")
    private boolean allowEditProjItems;

    public ProjectSetting() {
    }

    public ProjectSetting(Project project, String color, boolean autoDelete, boolean allowEditContents) {
        this.id = project.getId();
        this.project = project;
        this.color = color;
        this.autoDelete = autoDelete;
        this.allowEditContents = allowEditContents;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public boolean isAutoDelete() {
        return autoDelete;
    }

    public void setAutoDelete(boolean autoDelete) {
        this.autoDelete = autoDelete;
    }

    public boolean isAllowEditContents() {
        return allowEditContents;
    }

    public void setAllowEditContents(boolean allowEditContents) {
        this.allowEditContents = allowEditContents;
    }

    public boolean isAllowEditProjItems() {
        return allowEditProjItems;
    }

    public void setAllowEditProjItems(boolean allowEditProjItems) {
        this.allowEditProjItems = allowEditProjItems;
    }

    public com.bulletjournal.controller.models.ProjectSetting toPresentationModel() {
    return new com.bulletjournal.controller.models.ProjectSetting(
        this.color, this.autoDelete, this.allowEditContents, this.allowEditProjItems);
    }
}
