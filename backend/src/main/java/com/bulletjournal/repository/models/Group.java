package com.bulletjournal.repository.models;

import com.bulletjournal.repository.auditing.GroupEntityListeners;

import javax.persistence.*;
import java.util.*;
import java.util.stream.Collectors;

@Entity
@Table(name = "groups",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"owner", "name"})
        })
@EntityListeners(value = {GroupEntityListeners.class})
public class Group extends OwnedModel {

    public static final String DEFAULT_NAME = "Default";
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    Set<UserGroup> users = new HashSet<>();
    @Id
    @GeneratedValue(generator = "group_generator")
    @SequenceGenerator(
            name = "group_generator",
            sequenceName = "group_sequence",
            initialValue = 100
    )
    private Long id;
    @Column(name = "default_group", nullable = false, updatable = false)
    private boolean defaultGroup = false;
    @OneToMany(mappedBy = "group", fetch = FetchType.LAZY)
    private List<Project> projects = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<UserGroup> getUsers() {
        return users;
    }

    public Set<UserGroup> getAcceptedUsers() {
        return getUsers().stream().filter(u -> u.isAccepted()).collect(Collectors.toSet());
    }

    public void setUsers(Set<UserGroup> users) {
        this.users = users;
    }

    public void addUser(User user) {
        UserGroup userGroup = new UserGroup(user, this);
        if (!this.users.contains(userGroup)) {
            this.users.add(userGroup);
            user.addGroup(this);
        }
    }

    public List<Project> getProjects() {
        return projects;
    }

    public void addProject(Project project) {
        if (!this.projects.contains(project)) {
            this.projects.add(project);
            project.setGroup(this);
        }
    }


    public boolean isDefaultGroup() {
        return defaultGroup;
    }

    public void setDefaultGroup(boolean defaultGroup) {
        this.defaultGroup = defaultGroup;
    }

    public com.bulletjournal.controller.models.Group toPresentationModel() {
        return new com.bulletjournal.controller.models.Group(
                this.getId(), this.getName(), new com.bulletjournal.controller.models.User(this.getOwner()));
    }

    public com.bulletjournal.controller.models.Group toVerbosePresentationModel() {
        com.bulletjournal.controller.models.Group group = new com.bulletjournal.controller.models.Group(
                this.getId(), this.getName(), new com.bulletjournal.controller.models.User(this.getOwner()));
        group.setUsers(this.getUsers()
                .stream()
                .map(ug -> new com.bulletjournal.controller.models.UserGroup(ug.getUser().getName(), ug.isAccepted()))
                .collect(Collectors.toList()));
        return group;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Group)) return false;
        Group group = (Group) o;
        return isDefaultGroup() == group.isDefaultGroup() &&
                Objects.equals(getId(), group.getId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), isDefaultGroup());
    }
}
