package com.bulletjournal.repository.models;

import javax.persistence.*;
import java.util.Set;

@Entity
@Table(name = "groups",
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"owner", "name"})
        })
public class Group extends OwnedModel {
    @Id
    @GeneratedValue(generator = "group_generator")
    @SequenceGenerator(
            name = "group_generator",
            sequenceName = "group_sequence"
    )
    private Long id;

    @ManyToMany(mappedBy = "groups")
    Set<User> users;
}
