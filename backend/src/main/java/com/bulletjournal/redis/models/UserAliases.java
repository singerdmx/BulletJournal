package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

import java.util.Map;

@RedisHash(value = "UserAliases", timeToLive = 90_000_000)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserAliases {

    @Id
    private String username;

    private Map<String, String> aliases;

    public UserAliases() {
    }

    public UserAliases(String username, Map<String, String> aliases) {
        this.username = username;
        this.aliases = aliases;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Map<String, String> getAliases() {
        return aliases;
    }

    public void setAliases(Map<String, String> aliases) {
        this.aliases = aliases;
    }
}
