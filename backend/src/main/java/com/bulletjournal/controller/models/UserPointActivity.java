package com.bulletjournal.controller.models;

import java.util.Objects;

public class UserPointActivity {
    private Long id;
    private String username;
    private String description;
    private Integer pointChange;
    private Long createdAt;
    private Long updatedAt;

    public UserPointActivity(Long id, String username,
                             String description, Integer pointChange,
                             Long createdAt, Long updatedAt) {
        this.id = id;
        this.username = username;
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

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
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

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof UserPointActivity)) return false;
        UserPointActivity that = (UserPointActivity) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getUsername(), that.getUsername()) &&
                Objects.equals(getDescription(), that.getDescription()) &&
                Objects.equals(getPointChange(), that.getPointChange()) &&
                Objects.equals(getCreatedAt(), that.getCreatedAt()) &&
                Objects.equals(getUpdatedAt(), that.getUpdatedAt());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getUsername(), getDescription(), getPointChange(), getCreatedAt(), getUpdatedAt());
    }


}
