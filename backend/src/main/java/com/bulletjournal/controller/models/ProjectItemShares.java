package com.bulletjournal.controller.models;

import java.util.ArrayList;
import java.util.List;

public class ProjectItemShares {

    private List<User> users = new ArrayList<>();

    private List<ShareableLink> links = new ArrayList<>();

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<ShareableLink> getLinks() {
        return links;
    }

    public void setLinks(List<ShareableLink> links) {
        this.links = links;
    }
}
