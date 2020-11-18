package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import java.io.Serializable;
import java.util.Objects;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "CachedContent", timeToLive = 2)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class CachedContent implements Serializable {

  @Id
  private Long contentId;

  public CachedContent() {
  }

  public CachedContent(Long contentId) {
    this.contentId = contentId;
  }

  public Long getContentId() {
    return contentId;
  }

  public void setContentId(Long contentId) {
    this.contentId = contentId;
  }

  @Override
  public boolean equals(Object obj) {
    if (this == obj) {
      return true;
    }
    if (obj == null || getClass() != obj.getClass()) {
      return false;
    }
    CachedContent cachedContent = (CachedContent) obj;
    return Objects.equals(contentId, cachedContent.contentId);
  }

  @Override
  public int hashCode() {
    return Objects.hash(contentId);
  }

}
