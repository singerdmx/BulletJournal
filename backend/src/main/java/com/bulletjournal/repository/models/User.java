package com.bulletjournal.repository.models;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "users",
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
    Set<Group> groups;
}
