package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

@Embeddable
public class UserGroupKey implements Serializable {

    @NotNull
    @Column(name = "user_id")
    private Long userId;

    @NotNull
    @Column(name = "group_id")
    private Long groupId;

    public UserGroupKey() {
    }

    public UserGroupKey(Long userId, Long groupId) {
        this.userId = userId;
        this.groupId = groupId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }
}
