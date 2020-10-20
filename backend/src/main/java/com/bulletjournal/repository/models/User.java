package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Before;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Objects;
import java.util.Set;

@Entity
@Table(name = "users", uniqueConstraints = { @UniqueConstraint(columnNames = { "name" }) })
public class User extends NamedModel {
    @Id
    @GeneratedValue(generator = "user_generator")
    @SequenceGenerator(name = "user_generator", sequenceName = "user_sequence", initialValue = 100)
    private Long id;

    @Column(nullable = false)
    private Integer role = 0;

    @Column(nullable = false)
    private Integer points = 0;

    @Column(nullable = false, name = "user_timestamps")
    private String userTimestamps = "{}";

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private Set<UserGroup> groups = new HashSet<>();

    @Column(length = 50, nullable = false)
    private String timezone;

    @Column(length = 3)
    private String currency;

    @Column(length = 25)
    private String language;

    @Column(length = 100)
    private String email;

    @Column(name = "date_format", length = 10, nullable = false)
    private Integer dateFormat; // 0: "DD-MM-YYYY", 1: "MM-DD-YYYY"

    @Column(name = "time_format", length = 10, nullable = false)
    private Integer timeFormat; // 0: "1:00pm", 1: "13:00"

    // reminder before task
    @Column(name = "reminder_before_task")
    private Before reminderBeforeTask = Before.FIVE_MIN_BEFORE;

    @Column
    private String theme;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shared_tasks_project", referencedColumnName = "id")
    private Project sharedTasksProject;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shared_notes_project", referencedColumnName = "id")
    private Project sharedNotesProject;

    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "shared_transactions_project", referencedColumnName = "id")
    private Project sharedTransactionsProject;

    public String getUserTimestamps() {
        return userTimestamps;
    }

    public void setUserTimestamps(String userTimestamps) {
        this.userTimestamps = userTimestamps;
    }

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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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

    public String getTheme() {
        return theme;
    }

    public void setTheme(String theme) {
        this.theme = theme;
    }

    public boolean hasSharedTasksProject() {
        return this.sharedTasksProject != null;
    }

    public boolean hasSharedNotesProject() {
        return this.sharedNotesProject != null;
    }

    public boolean hasSharedTransactionsProject() {
        return this.sharedTransactionsProject != null;
    }

    public Project getSharedTasksProject() {
        return sharedTasksProject;
    }

    public void setSharedTasksProject(Project sharedTasksProject) {
        this.sharedTasksProject = sharedTasksProject;
    }

    public Project getSharedNotesProject() {
        return sharedNotesProject;
    }

    public void setSharedNotesProject(Project sharedNotesProject) {
        this.sharedNotesProject = sharedNotesProject;
    }

    public Project getSharedTransactionsProject() {
        return sharedTransactionsProject;
    }

    public void setSharedTransactionsProject(Project sharedTransactionsProject) {
        this.sharedTransactionsProject = sharedTransactionsProject;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (o == null || getClass() != o.getClass())
            return false;
        User user = (User) o;
        return Objects.equals(id, user.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }

    public Integer getRole() {
        return role;
    }

    public void setRole(Integer role) {
        this.role = role;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

}
