package com.bulletjournal.controller.models;

public class LockUserParams {

    private String name;
    private String ip;
    private String reason;

    public LockUserParams() {
    }

    public LockUserParams(String name, String ip, String reason) {
        this.name = name;
        this.ip = ip;
        this.reason = reason;
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

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }

}