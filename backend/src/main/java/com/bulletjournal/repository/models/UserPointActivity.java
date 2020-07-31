package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "user_point_activities")
public class UserPointActivity extends AuditModel {
    @Id
    @GeneratedValue(generator = "user_point_activity_generator")
    @SequenceGenerator(name = "user_point_activity_generator",
            sequenceName = "user_point_activity_sequence", initialValue = 100,
            allocationSize = 2)
    private Long id;

    @JoinColumn(table = "users", name = "username", referencedColumnName = "name", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @Column(name = "username", nullable = false)
    private String username;

    @Column(nullable = false)
    private Integer pointChange;

    @Column(nullable = false)
    private String description;

    public UserPointActivity() {
    }

    public UserPointActivity(String username, Integer pointChange, String description) {
        this.username = username;
        this.pointChange = pointChange;
        this.description = description;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Integer getPointChange() {
        return pointChange;
    }

    public void setPointChange(Integer pointChange) {
        this.pointChange = pointChange;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public com.bulletjournal.controller.models.UserPointActivity toPresentationModel() {
        return new com.bulletjournal.controller.models.UserPointActivity(
                this.getId(), this.getUsername(), this.getDescription(), this.getPointChange(),
                this.getCreatedAt().getTime(), this.getUpdatedAt().getTime());
    }
}
