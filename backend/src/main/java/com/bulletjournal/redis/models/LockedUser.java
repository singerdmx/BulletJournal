package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.io.Serializable;
import java.util.Objects;


@RedisHash(value = "LockedUser")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LockedUser implements Serializable {

    @Id
    private String name;
    private String reason;

    @TimeToLive
    private Long expiration;

    public LockedUser() {
    }

    public LockedUser(String name, String reason) {
        this.name = name;
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getExpiration() {
        return expiration;
    }

    public double getExpirationInHour() {
        return getExpiration() / 3600.0;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        LockedUser luser = (LockedUser) o;
        return Objects.equals(name, luser.name);
    }

    @Override
    public int hashCode() {
        return Objects.hash(name);
    }

    @Override
    public String toString() {
        return "User{" +
                ", name='" + name + '\'' +
                '}';
    }
}

