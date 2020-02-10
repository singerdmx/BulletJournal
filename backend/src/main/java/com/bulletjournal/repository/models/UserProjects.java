package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "user_projects")
public class UserProjects extends AuditModel {

    @Id
    private String name;

    @Lob
    @Column
    private String projects;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getProjects() {
        return projects;
    }

    public void setProjects(String projects) {
        this.projects = projects;
    }
}
