package com.bulletjournal.repository.models;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "groups",
        indexes = {@Index(name = "group_name_owner_index", columnList = "name,owner")},
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"owner", "name"})
        })
public class Group extends OwnedModel {

    public static final String DEFAULT_NAME = "Default";

    @Id
    @GeneratedValue(generator = "group_generator")
    @SequenceGenerator(
            name = "group_generator",
            sequenceName = "group_sequence"
    )
    private Long id;

    @ManyToMany(mappedBy = "groups")
    Set<User> users = new HashSet<>();

    @OneToMany(mappedBy = "group")
    private List<Project> projects = new ArrayList<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<User> getUsers() {
        return users;
    }

    public void addUser(User user) {
        if (this.users.contains(user)) {
            this.users.add(user);
            user.getGroups().add(this);
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

    public com.bulletjournal.controller.models.Group toPresentationModel() {
        return new com.bulletjournal.controller.models.Group(this.getId(), this.getName(), this.getOwner());
    }
}
