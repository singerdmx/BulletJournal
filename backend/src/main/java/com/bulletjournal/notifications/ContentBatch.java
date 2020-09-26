package com.bulletjournal.notifications;

import com.bulletjournal.repository.models.ContentModel;
import com.bulletjournal.repository.models.ProjectItemModel;

import java.util.List;

public class ContentBatch<K extends ContentModel, T extends ProjectItemModel> {

    private List<K> contents;
    private List<T> projectItems;
    private List<String> owners;

    public ContentBatch(List<K> contents, List<T> projectItems, List<String> owners) {
        this.contents = contents;
        this.projectItems = projectItems;
        this.owners = owners;
    }

    public List<K> getContents() {
        return contents;
    }

    public void setContents(List<K> contents) {
        this.contents = contents;
    }

    public List<T> getProjectItems() {
        return projectItems;
    }

    public void setProjectItems(List<T> projectItems) {
        this.projectItems = projectItems;
    }

    public List<String> getOwners() {
        return owners;
    }

    public void setOwners(List<String> owners) {
        this.owners = owners;
    }
}
