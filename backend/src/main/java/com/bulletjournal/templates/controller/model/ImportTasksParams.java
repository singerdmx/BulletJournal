package com.bulletjournal.templates.controller.model;

import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

public class ImportTasksParams extends RemoveUserSampleTasksParams {
    @NotNull
    private List<Long> selections;
    @NotNull
    private Long categoryId;
    private boolean subscribed;
    private String scrollId;

    public List<Long> getSelections() {
        return selections.stream().filter(s -> s != null).collect(Collectors.toList());
    }

    public void setSelections(List<Long> selections) {
        this.selections = selections;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public boolean isSubscribed() {
        return subscribed;
    }

    public void setSubscribed(boolean subscribed) {
        this.subscribed = subscribed;
    }

    public String getScrollId() {
        return scrollId;
    }

    public void setScrollId(String scrollId) {
        this.scrollId = scrollId;
    }
}
