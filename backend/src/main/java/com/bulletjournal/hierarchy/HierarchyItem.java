package com.bulletjournal.hierarchy;

import java.util.ArrayList;
import java.util.List;

public class HierarchyItem {

    public static final String SUB_ITEMS_KEY_REPLACEMENT = "s";

    private Long id;

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
}
