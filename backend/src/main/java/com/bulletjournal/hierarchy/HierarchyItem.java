package com.bulletjournal.hierarchy;

import com.bulletjournal.templates.repository.model.Choice;

import java.util.ArrayList;
import java.util.List;

public class HierarchyItem {

    public static final String SUB_ITEMS_KEY_REPLACEMENT = "s";

    private Long id;

    private List<Choice> choices = new ArrayList<>();

    private List<HierarchyItem> s = new ArrayList<>();

    public HierarchyItem() {
    }

    public HierarchyItem(Long id) {
        this.id = id;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<HierarchyItem> getS() {
        return s;
    }

    public void setS(List<HierarchyItem> s) {
        this.s = s;
    }

    public List<Choice> getChoices() {
        return choices;
    }

    public void setChoices(List<Choice> choices) {
        this.choices = choices;
    }
}
