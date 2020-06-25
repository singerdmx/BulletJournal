package com.bulletjournal.controller.models;

import com.bulletjournal.redis.models.LockedIP;
import com.bulletjournal.redis.models.LockedUser;

public class LockedUsersAndIPs {

    private Iterable<LockedUser> users;

    private Iterable<LockedIP> ips;

    public LockedUsersAndIPs() {
    }

    public Iterable<LockedUser> getUsers() {
        return users;
    }

    public void setUsers(Iterable<LockedUser> users) {
        this.users = users;
    }

    public Iterable<LockedIP> getIps() {
        return ips;
    }

    public void setIps(Iterable<LockedIP> ips) {
        this.ips = ips;
    }
}
