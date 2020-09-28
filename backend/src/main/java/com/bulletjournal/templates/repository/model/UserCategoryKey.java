package com.bulletjournal.templates.repository.model;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import java.io.Serializable;

@Embeddable
public class UserCategoryKey implements Serializable {

    @Column(name = "user_id")
    Long userId;

    @Column(name = "category_id")
    Long categoryId;

    @Column(name = "metadata_keyword")
    String metadataKeyword;

    public UserCategoryKey() {
    }

    public UserCategoryKey(Long userId, Long categoryId, String metadataKeyword) {
        this.userId = userId;
        this.categoryId = categoryId;
        this.metadataKeyword = metadataKeyword;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getMetadataKeyword() {
        return metadataKeyword;
    }

    public void setMetadataKeyword(String metadataKeyword) {
        this.metadataKeyword = metadataKeyword;
    }
}
