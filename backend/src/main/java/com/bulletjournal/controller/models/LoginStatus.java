package com.bulletjournal.controller.models;

public class LoginStatus {

    private Boolean loggedIn;

    private Long expirationTime;

    public LoginStatus() {
    }

    public LoginStatus(Boolean loggedIn, Long expirationTime) {
        this.loggedIn = loggedIn;
        this.expirationTime = expirationTime;
    }

    public Boolean getLoggedIn() {
        return loggedIn;
    }

    public void setLoggedIn(Boolean loggedIn) {
        this.loggedIn = loggedIn;
    }

    public Long getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Long expirationTime) {
        this.expirationTime = expirationTime;
    }
}
