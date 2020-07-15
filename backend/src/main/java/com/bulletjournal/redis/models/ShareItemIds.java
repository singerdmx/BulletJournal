package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.TimeToLive;

import java.io.Serializable;
import java.util.Objects;
import java.util.Set;

@RedisHash(value = "ShareItemIds", timeToLive = 21600)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ShareItemIds implements Serializable {

    @Id
    private String scrollId;

    private Set<Long> sharedNoteIds;
    private Set<Long> sharedTaskIds;

    @TimeToLive
    private Long expiration;

    public ShareItemIds() {
    }

    public ShareItemIds(String scrollId, Set<Long> sharedNoteIds, Set<Long> sharedTaskIds) {
        this.scrollId = scrollId;
        this.sharedNoteIds = sharedNoteIds;
        this.sharedTaskIds = sharedTaskIds;
    }

    public String getScrollId() {
        return scrollId;
    }

    public Set<Long> getSharedTaskIds() {
        return sharedTaskIds;
    }

    public void setSharedTaskIds(Set<Long> sharedTaskIds) {
        this.sharedTaskIds = sharedTaskIds;
    }

    public Long getExpiration() {
        return expiration;
    }

    public Set<Long> getSharedNoteIds() {
        return sharedNoteIds;
    }

    public void setSharedNoteIds(Set<Long> sharedNoteIds) {
        this.sharedNoteIds = sharedNoteIds;
    }

    public void setExpiration(Long expiration) {
        this.expiration = expiration;
    }

    public void setScrollId(String scrollId) {
        this.scrollId = scrollId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof ShareItemIds)) return false;
        ShareItemIds that = (ShareItemIds) o;
        return Objects.equals(getScrollId(), that.getScrollId()) &&
                Objects.equals(sharedNoteIds, that.sharedNoteIds) &&
                Objects.equals(getSharedTaskIds(), that.getSharedTaskIds()) &&
                Objects.equals(getExpiration(), that.getExpiration());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getScrollId(), sharedNoteIds, getSharedTaskIds(), getExpiration());
    }

    @Override
    public String toString() {
        return "ShareItemIds{" +
                "scrollId='" + scrollId + '\'' +
                ", sharedNoteIds=" + sharedNoteIds +
                ", sharedTaskIds=" + sharedTaskIds +
                ", expiration=" + expiration +
                '}';
    }
}
