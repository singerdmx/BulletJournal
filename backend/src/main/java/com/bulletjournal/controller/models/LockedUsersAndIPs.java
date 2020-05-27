package com.bulletjournal.controller.models;

import com.bulletjournal.redis.LockedIP;
import com.bulletjournal.redis.LockedUser;

import java.util.List;

public class LockedUsersAndIPs {

    private List<LockedUser> users;

    private List<LockedIP> ips;

    public LockedUsersAndIPs() {
    }

    public LockedUsersAndIPs(List<LockedUser> users, List<LockedIP> ips) {
        this.users = users;
        this.ips = ips;
    }

    public List<LockedUser> getUsers() {
        return users;
    }

    public void setUsers(List<LockedUser> users) {
        this.users = users;
    }

    public List<LockedIP> getIps() {
        return ips;
    }

    public void setIps(List<LockedIP> ips) {
        this.ips = ips;
    }
}
