package com.bulletjournal.notifications;

import com.bulletjournal.redis.models.EtagType;

import java.io.Serializable;

public class CreateEtagEvent implements Serializable {

    private Long id;

    private String userProjectId;

    private EtagType etagType;

    public CreateEtagEvent() {
    }

    public CreateEtagEvent(Long id, String userProjectId, EtagType etagType) {
        this.id = id;
        this.userProjectId = userProjectId;
        this.etagType = etagType;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserProjectId() {
        return userProjectId;
    }

    public void setUserProjectId(String userProjectId) {
        this.userProjectId = userProjectId;
    }

    public EtagType getEtagType() {
        return etagType;
    }

    public void setEtagType(EtagType etagType) {
        this.etagType = etagType;
    }
}
