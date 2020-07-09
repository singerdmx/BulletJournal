package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;


@RedisHash(value = "FirstTimeUser", timeToLive = 90_000_000)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class FirstTimeUser {

    @Id
    private String username;


    public FirstTimeUser() {
    }

    public FirstTimeUser(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

}
