package com.bulletjournal.notifications;

import com.bulletjournal.redis.models.EtagType;

import java.io.Serializable;

public class CreateEtagEvent implements Serializable {

    private String contentId;

    private EtagType etagType;

    public CreateEtagEvent() {
    }

    public CreateEtagEvent(String contentId, EtagType etagType) {
        this.contentId = contentId;
        this.etagType = etagType;
    }

    public String getContentId() {
        return contentId;
    }

    public void setContentId(String contentId) {
        this.contentId = contentId;
    }

    public EtagType getEtagType() {
        return etagType;
    }

    public void setEtagType(EtagType etagType) {
        this.etagType = etagType;
    }
}
