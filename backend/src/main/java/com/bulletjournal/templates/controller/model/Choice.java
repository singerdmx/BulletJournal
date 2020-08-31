package com.bulletjournal.templates.controller.model;

import java.util.ArrayList;
import java.util.List;

public class Choice {

    private Long id;

    private String name;

    private boolean multiple;

    private List<Category> categories = new ArrayList<>();

    private List<Selection> selections = new ArrayList<>();

    public Choice() {

    }

    public Choice(Long id, String name, boolean multiple) {
        this.id = id;
        this.name = name;
        this.multiple = multiple;
    }

    public Choice(Long id, String name, boolean multiple, List<Selection> selections) {
        this.id = id;
        this.name = name;
        this.multiple = multiple;
        this.selections = selections;
    }

    public Choice(Long id, String name, boolean multiple, List<Category> categories, List<Selection> selections) {
        this.id = id;
        this.name = name;
        this.multiple = multiple;
        this.categories = categories;
        this.selections = selections;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public boolean isMultiple() {
        return multiple;
    }

    public void setMultiple(boolean multiple) {
        this.multiple = multiple;
    }

    public List<Category> getCategories() {
        return categories;
    }

    public void setCategories(List<Category> categories) {
        this.categories = categories;
    }

    public List<Selection> getSelections() {
        return selections;
    }

    public void setSelections(List<Selection> selections) {
        this.selections = selections;
    }
}
