package com.bulletjournal.controller.models;

import java.sql.Timestamp;
import java.util.Objects;

public class UserPointActivity {
    private Long id;
    private User user;
    private String description;
    private Integer pointChange;
    private Timestamp createdAt;
    private Timestamp updatedAt;

    public UserPointActivity(Long id, User user,
                             String description, Integer pointChange,
                             Timestamp createdAt, Timestamp updatedAt) {
        this.id = id;
        this.user = user;
        this.description = description;
        this.pointChange = pointChange;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPointChange() {
        return pointChange;
    }

    public void setPointChange(Integer pointChange) {
        this.pointChange = pointChange;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public Timestamp getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Timestamp updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserPointActivity)) return false;
        UserPointActivity that = (UserPointActivity) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getUser(), that.getUser()) &&
                Objects.equals(getDescription(), that.getDescription()) &&
                Objects.equals(getPointChange(), that.getPointChange()) &&
                Objects.equals(getCreatedAt(), that.getCreatedAt()) &&
                Objects.equals(getUpdatedAt(), that.getUpdatedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getUser(), getDescription(), getPointChange(), getCreatedAt(), getUpdatedAt());
    }


}
