package com.bulletjournal.notifications;

import com.bulletjournal.redis.models.EtagType;

import java.io.Serializable;

public class CreateEtagEvent implements Serializable {

    private String id;

    private EtagType etagType;

    public CreateEtagEvent() {
    }

    public CreateEtagEvent(String id, EtagType etagType) {
        this.id = id;
        this.etagType = etagType;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public EtagType getEtagType() {
        return etagType;
    }

    public void setEtagType(EtagType etagType) {
        this.etagType = etagType;
    }
}
