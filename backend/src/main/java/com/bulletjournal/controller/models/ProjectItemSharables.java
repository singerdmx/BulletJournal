package com.bulletjournal.controller.models;

import java.util.ArrayList;
import java.util.List;

public class ProjectItemSharables {

    private List<User> users = new ArrayList<>();

    private List<SharableLink> links = new ArrayList<>();

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }

    public List<SharableLink> getLinks() {
        return links;
    }

    public void setLinks(List<SharableLink> links) {
        this.links = links;
    }
}
