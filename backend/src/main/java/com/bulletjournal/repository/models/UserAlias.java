package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "user_aliases")
public class UserAlias extends AuditModel {

    @Id
    private String owner;

    @Column(columnDefinition = "TEXT")
    private String aliases;

    public UserAlias() {
    }

    public UserAlias(String owner) {
        this.owner = owner;
        this.aliases = "{}"; // empty map
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getAliases() {
        return aliases;
    }

    public void setAliases(String aliases) {
        this.aliases = aliases;
    }
}
