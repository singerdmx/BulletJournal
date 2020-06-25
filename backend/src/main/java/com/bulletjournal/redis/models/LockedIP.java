package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.io.Serializable;
import java.util.Objects;

@RedisHash(value = "LockedIP")
@JsonInclude(JsonInclude.Include.NON_NULL)
public class LockedIP implements Serializable {
    @Id
    private String ip;
    private String reason;

    @TimeToLive
    private Long expiration;

    public LockedIP() {
    }

    public LockedIP(String ip, String reason) {
        this.ip = ip;
        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

    public String getIP() {
        return ip;
    }

    public void setIP(String ip) {
        this.ip = ip;
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
        LockedIP lockedIP = (LockedIP) o;
        return Objects.equals(ip, lockedIP.ip) &&
                Objects.equals(reason, lockedIP.reason) &&
                Objects.equals(expiration, lockedIP.expiration);
    }

    @Override
    public int hashCode() {
        return Objects.hash(ip, reason, expiration);
    }
}
