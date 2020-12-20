package com.bulletjournal.controller.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;
import org.springframework.data.redis.core.RedisHash;

import java.io.Serializable;
import java.util.Objects;


@RedisHash(value = "User", timeToLive = 15770000)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class User implements Serializable {

    private Integer id;
    @Id
    private String name;
    @Transient
    private String alias;
    private String thumbnail;
    private String avatar;
    private String email;

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
        this.alias = name;
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
        this.alias = name;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
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

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        User user = (User) o;
        return Objects.equals(name, user.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", thumbnail='" + thumbnail + '\'' +
                ", avatar='" + avatar + '\'' +
                ", email='" + email + '\'' +
                '}';
    }
}
