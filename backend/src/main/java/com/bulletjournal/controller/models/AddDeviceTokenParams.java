package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;

public class AddDeviceTokenParams {

    @NotNull
    private String token;

    public AddDeviceTokenParams() {
    }

    public AddDeviceTokenParams(String token) {
        this.token = token;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
