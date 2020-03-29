package com.bulletjournal.controller.models;

import com.bulletjournal.repository.models.Project;
import com.google.gson.annotations.Expose;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Objects;

public class ProjectItem {

    @Expose
    protected Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    protected String name;

    @NotNull
    protected Long projectId;

    protected String owner;

    protected String ownerAvatar;

    protected List<Label> labels;

    protected Long updatedAt;

    public ProjectItem() {
    }

    public ProjectItem(Long id, @NotBlank @Size(min = 1, max = 100) String name, String owner,
                       @NotNull Project project, List<Label> labels) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        this.projectId = project.getId();
        this.labels = labels;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public List<Label> getLabels() {
        return labels;
    }

    public void setLabels(List<Label> labels) {
        this.labels = labels;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getOwnerAvatar() {
        return ownerAvatar;
    }

    public void setOwnerAvatar(String ownerAvatar) {
        this.ownerAvatar = ownerAvatar;
    }

    public Long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ProjectItem)) return false;
        ProjectItem that = (ProjectItem) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getName(), that.getName()) &&
                Objects.equals(getProjectId(), that.getProjectId()) &&
                Objects.equals(getOwner(), that.getOwner()) &&
                Objects.equals(getLabels(), that.getLabels());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getProjectId(), getOwner(), getLabels());
    }

    public void clone(ProjectItem projectItem) {
        this.setId(projectItem.getId());
        this.setName(projectItem.getName());
        this.setProjectId(projectItem.getProjectId());
        this.setLabels(projectItem.getLabels());
        this.setOwner(projectItem.getOwner());
        this.setOwnerAvatar(projectItem.getOwnerAvatar());
        this.setUpdatedAt(projectItem.getUpdatedAt());
    }
}
