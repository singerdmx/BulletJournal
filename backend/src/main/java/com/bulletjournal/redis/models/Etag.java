package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.Objects;

@RedisHash(value = "Etag", timeToLive = 3600000)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class Etag implements Serializable {

    @Id
    private String index;
    private String etag;

    public Etag() {
    }

    public Etag(String username, EtagType type, String etag) {
        this.index = username + "@" + type.toString();
        this.etag = etag;
    }

    public Etag(String username, String type, String etag)
    {
        this.index = username + "@" + type;
        this.etag = etag;
    }

    public Etag(String index, String etag) {
        this.index = index;
        this.etag = etag;
    }

    public String getIndex() {
        return index;
    }

    public void setIndex(String index) {
        this.index = index;
    }

    public void setIndex(String username, String type) {
        this.index = username + "@" + type;
    }

    public void setIndex(String username, EtagType type) {
        this.index = username + "@" + type.toString();
    }

    public String getUsername() {
        int split = index.lastIndexOf("@");
        if (split == -1)
            throw new IllegalArgumentException("Illegal index format");
        return index.substring(0, split);
    }

    public void setUsername(String username) {
        if (Objects.isNull(index))
            throw new IllegalStateException("Cannot set username with null index");

        int split = index.lastIndexOf("@");
        if (split == -1)
            throw new IllegalArgumentException("Illegal index format");

        this.setIndex(index = username + index.substring(split));
    }

    public String getType() {
        int split = index.lastIndexOf("@");
        if (split == -1)
            throw new IllegalArgumentException("Illegal index format");
        return index.substring(split + 1);
    }

    public void setType(String type) {
        if (Objects.isNull(index))
            throw new IllegalStateException("Cannot set type with null index");

        int split = index.lastIndexOf("@");
        if (split == -1)
            throw new IllegalArgumentException("Illegal index format");

        this.setIndex(index.substring(0, split) + "@" + type);
    }

    public EtagType getEtagType() {
        return EtagType.of(this.getType());
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }
}
