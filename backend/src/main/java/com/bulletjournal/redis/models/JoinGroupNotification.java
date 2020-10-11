package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import javax.validation.constraints.NotNull;
import java.io.Serializable;

@RedisHash(value = "JoinGroupNotification", timeToLive = 86400)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class JoinGroupNotification implements Serializable {

    @Id
    private String uid;
    @NotNull
    private Long notificationId;

    public JoinGroupNotification() {
    }

    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public Long getNotificationId() {
        return notificationId;
    }

    public void setNotificationId(Long notificationId) {
        this.notificationId = notificationId;
    }

    public JoinGroupNotification(String uid, @NotNull Long notificationId) {
        this.uid = uid;
        this.notificationId = notificationId;
    }
}
