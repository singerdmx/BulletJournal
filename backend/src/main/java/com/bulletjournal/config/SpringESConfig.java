package com.bulletjournal.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;


@Configuration
@ConfigurationProperties(prefix = "spring.elasticsearch.rest")
public class SpringESConfig {

    private String[] uris;
    private String username;
    private String password;
    private Boolean enable;

    public String[] getUris() {
        return uris;
    }

    public void setUris(String[] uris) {
        this.uris = uris;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public Boolean getEnable() {
        return enable;
    }

    public void setEnable(Boolean enable) {
        this.enable = enable;
    }
}

