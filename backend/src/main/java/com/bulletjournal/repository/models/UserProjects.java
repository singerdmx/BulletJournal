package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_projects")
public class UserProjects extends AuditModel {

    @Id
    private String owner;

    /**
     * Store self-owned projects' hierarchy
     */
    @Column(length = 10485760)
    private String ownedProjects;

    /**
     * Stores projects shared with me - order of project owners
     */
    @Column(length = 10485760)
    private String sharedProjects;

    public UserProjects() {
    }

    public UserProjects(String owner) {
        this.owner = owner;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getOwnedProjects() {
        return ownedProjects;
    }

    public void setOwnedProjects(String projects) {
        this.ownedProjects = projects;
    }

    public String getSharedProjects() {
        return sharedProjects;
    }

    public void setSharedProjects(String sharedProjects) {
        this.sharedProjects = sharedProjects;
    }
}
