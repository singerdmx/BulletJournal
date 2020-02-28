package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Before;

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
            sequenceName = "user_sequence",
            initialValue = 100
    )
    private Long id;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<UserGroup> groups = new HashSet<>();

    @Column(length = 50, nullable = false)
    private String timezone;

    @Column(length = 50)
    private String currency;

    @Column(length = 25)
    private String language;

    @Column(name = "date_format", length = 10, nullable = false)
    private Integer dateFormat; // 0: "DD-MM-YYYY", 1: "MM-DD-YYYY"

    @Column(name = "time_format", length = 10, nullable = false)
    private Integer timeFormat; // 0: "1:00pm", 1: "13:00"

    // reminder before task
    @Column(name = "reminder_before_task")
    private Before reminderBeforeTask = Before.FIVE_MIN_BEFORE;

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

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }

    public Before getReminderBeforeTask() {
        return reminderBeforeTask;
    }

    public void setReminderBeforeTask(Integer reminderBeforeTask) {
        this.reminderBeforeTask = Before.getType(reminderBeforeTask);
    }

    public Integer getDateFormat() {
        return dateFormat;
    }

    public void setDateFormat(Integer dateFormat) {
        this.dateFormat = dateFormat;
    }

    public Integer getTimeFormat() {
        return timeFormat;
    }

    public void setTimeFormat(Integer timeFormat) {
        this.timeFormat = timeFormat;
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
