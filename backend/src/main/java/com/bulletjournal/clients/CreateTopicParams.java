package com.bulletjournal.clients;

public class CreateTopicParams {
    private String title;
    private String raw;
    private Integer category;

    public CreateTopicParams() {
    }

    public CreateTopicParams(String title, String raw, Integer category) {
        this.title = title;
        this.raw = raw;
        this.category = category;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getRaw() {
        return raw;
    }

    public void setRaw(String raw) {
        this.raw = raw;
    }

    public Integer getCategory() {
        return category;
    }

    public void setCategory(Integer category) {
        this.category = category;
    }
}
