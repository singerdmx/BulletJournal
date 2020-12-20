package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.repository.models.Project;
import com.google.gson.annotations.Expose;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

public abstract class ProjectItem {

    @Expose
    protected Long id;

    @NotBlank
    @Size(min = 1, max = 100)
    protected String name;

    @NotNull
    protected Long projectId;

    @NotNull
    protected User owner;

    protected List<Label> labels;

    protected Long updatedAt;

    protected Long createdAt;

    protected boolean shared = false;

    public ProjectItem() {
    }

    public ProjectItem(Long id, @NotBlank @Size(min = 1, max = 100) String name, @NotNull User owner,
                       @NotNull Project project, List<Label> labels) {
        this.id = id;
        this.name = name;
        this.owner = owner;
        if (project != null) {
            this.projectId = project.getId();
        }
        this.labels = labels;
    }

    public static <T extends ProjectItem> List<T> addAvatar(
            List<T> projectItems, final UserClient userClient) {
        projectItems.forEach(item -> addAvatar(item, userClient));
        return projectItems;
    }

    public static <T extends ProjectItem> T addAvatar(T projectItem, UserClient userClient) {
        projectItem.setOwner(userClient.getUser(projectItem.getOwner().getName()));
        switch (projectItem.getContentType()) {
            case TRANSACTION:
                Transaction transaction = ((Transaction) projectItem);
                transaction.setPayer(userClient.getUser(transaction.getPayer().getName()));
                break;
            case TASK:
                Task task = ((Task) projectItem);
                task.setAssignees(
                        task.getAssignees().stream()
                                .map(a -> userClient.getUser(a.getName())).collect(Collectors.toList()));
                if (task.getSubTasks() != null) {
                    for (Task subTask : task.getSubTasks()) {
                        addAvatar(subTask, userClient);
                    }
                }
                break;
            case NOTE:
                Note note = (Note) projectItem;
                if (note.getSubNotes() != null) {
                    for (Note subNote : note.getSubNotes()) {
                        addAvatar(subNote, userClient);
                    }
                }
                break;
            default:
                throw new IllegalArgumentException("Invalid ContentType: " + projectItem.getContentType());
        }

        return projectItem;
    }

    public abstract ContentType getContentType();

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

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public Long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isShared() {
        return shared;
    }

    public void setShared(boolean shared) {
        this.shared = shared;
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
        this.setUpdatedAt(projectItem.getUpdatedAt());
        this.setCreatedAt(projectItem.getCreatedAt());
    }

    @Override
    public String toString() {
        return "ProjectItem{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", projectId=" + projectId +
                ", owner=" + owner +
                '}';
    }
}
