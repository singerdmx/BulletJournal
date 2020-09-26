package com.bulletjournal.notifications;

import com.bulletjournal.repository.models.Group;

public class SampleProjectsCreation {
    private String username;
    private Group group;

    public SampleProjectsCreation(String username, Group group) {
        this.username = username;
        this.group = group;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Group getGroup() {
        return group;
    }

    public void setGroup(Group group) {
        this.group = group;
    }
}
