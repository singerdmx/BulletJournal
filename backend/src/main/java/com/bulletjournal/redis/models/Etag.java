package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;

@RedisHash(value = "Etag", timeToLive = 3600000)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Etag implements Serializable {

    @Id
    private String username;
    private String type;
    private String etag;

    public Etag() {
    }

    public Etag(String username, String type, String etag) {
        this.username = username;
        this.type = type;
        this.etag = etag;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }
}
