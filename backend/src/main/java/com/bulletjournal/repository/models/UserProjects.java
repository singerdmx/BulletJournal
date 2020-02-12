package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "user_projects")
public class UserProjects extends AuditModel {

    @Id
    private String owner;

    @Lob
    @Column
    private String projects;

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getProjects() {
        return projects;
    }

    public void setProjects(String projects) {
        this.projects = projects;
    }
}
