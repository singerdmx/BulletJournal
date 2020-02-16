package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;


@RedisHash(value = "User", timeToLive = 60000)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User implements Serializable {

    private Integer id;
    @Id
    private String name;
    private String thumbnail;
    private String avatar;

    public User() {
    }

    public User(String name) {
        this(name, null, null);
    }

    public User(String name, String thumbnail, String avatar) {
        this(null, name, thumbnail, avatar);
    }

    public User(Integer id, String name, String thumbnail, String avatar) {
        this.id = id;
        this.name = name;
        this.thumbnail = thumbnail;
        this.avatar = avatar;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getThumbnail() {
        return thumbnail;
    }

    public void setThumbnail(String thumbnail) {
        this.thumbnail = thumbnail;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", thumbnail='" + thumbnail + '\'' +
                ", avatar='" + avatar + '\'' +
                '}';
    }
}
