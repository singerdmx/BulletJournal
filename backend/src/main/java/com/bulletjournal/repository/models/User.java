package com.bulletjournal.repository.models;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "users",
        indexes = {@Index(name = "user_name_index", columnList = "name")},
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"name"})
        })
public class User extends NamedModel {
    @Id
    @GeneratedValue(generator = "user_generator")
    @SequenceGenerator(
            name = "user_generator",
            sequenceName = "user_sequence"
    )
    Long id;

    @ManyToMany
    @JoinTable(
            name = "user_groups",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "group_id"))
    Set<Group> groups = new HashSet<>();

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<Group> getGroups() {
        return groups;
    }

    public void addGroup(Group group) {
        if (!this.groups.contains(group)) {
            this.groups.add(group);
            group.addUser(this);
        }
    }
}
