package com.bulletjournal.es.repository.models;

import org.springframework.data.elasticsearch.annotations.Document;

import javax.persistence.Id;

@Document(indexName = "project_items")
public class SearchIndex {

    @Id
    private String id;

    private String type;

    private Long groupId;

    private String value;

    private String parentId;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Long getGroupId() {
        return groupId;
    }

    public void setGroupId(Long groupId) {
        this.groupId = groupId;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getParentId() {
        return parentId;
    }

    public void setParentId(String parentId) {
        this.parentId = parentId;
    }
}