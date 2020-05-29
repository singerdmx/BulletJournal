package com.bulletjournal.controller.models;

public class UnlockUserParams {

    private String name;
    private String ip;

    public UnlockUserParams() {
    }

    public UnlockUserParams(String name, String ip) {
        this.name = name;
        this.ip = ip;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIp() {
        return ip;
    }

    public void setIp(String ip) {
        this.ip = ip;
    }

}