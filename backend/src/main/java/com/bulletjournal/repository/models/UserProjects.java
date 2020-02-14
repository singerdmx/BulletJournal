package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "user_projects")
public class UserProjects extends AuditModel {

    @Id
    private String owner;

    /**
     * Store self-owned projects' hierarchy
     */
    @Lob
    @Column
    private String ownedProjects;

    /**
     * Stores projects shared with me - order of project owners
     */
    @Lob
    @Column
    private String sharedProjects;

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
