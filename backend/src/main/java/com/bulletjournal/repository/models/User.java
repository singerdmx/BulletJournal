package com.bulletjournal.repository.models;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
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
    private Long id;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<UserGroup> groups = new HashSet<>();

    @Column(length = 20)
    private String timezone;

    @Column(length = 15)
    private String currency;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Set<UserGroup> getGroups() {
        return groups;
    }

    public void addGroup(Group group) {
        UserGroup userGroup = new UserGroup(this, group);
        if (!this.groups.contains(userGroup)) {
            this.groups.add(userGroup);
            group.addUser(this);
        }
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}
