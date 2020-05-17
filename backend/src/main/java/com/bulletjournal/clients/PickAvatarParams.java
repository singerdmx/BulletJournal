package com.bulletjournal.clients;

import com.fasterxml.jackson.annotation.JsonProperty;

public class PickAvatarParams {
    private String type;
    @JsonProperty("upload_id")
    private Integer uploadId;

    public PickAvatarParams() {
    }

    public PickAvatarParams(String type, Integer uploadId) {
        this.type = type;
        this.uploadId = uploadId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Integer getUploadId() {
        return uploadId;
    }

    public void setUploadId(Integer uploadId) {
        this.uploadId = uploadId;
    }
}
