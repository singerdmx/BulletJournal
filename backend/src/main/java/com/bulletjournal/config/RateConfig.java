package com.bulletjournal.config;


import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "rate.limit")
public class RateConfig {

    private int fileUpload;
    private int user;
    private int publicItem;

    public int getFileUpload() {
        return fileUpload;
    }

    public void setFileUpload(int fileUpload) {
        this.fileUpload = fileUpload;
    }

    public int getUser() {
        return user;
    }

    public void setUser(int user) {
        this.user = user;
    }

    public int getPublicItem() {
        return publicItem;
    }

    public void setPublicItem(int publicItem) {
        this.publicItem = publicItem;
    }
}

/*
rate.limit.fileUpload=5
rate.limit.user=150
rate.limit.publicItem=15
*/