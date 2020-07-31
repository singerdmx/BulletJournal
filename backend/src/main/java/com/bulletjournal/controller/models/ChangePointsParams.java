package com.bulletjournal.controller.models;

public class ChangePointsParams {
    private Integer points;
    private String description;

    public ChangePointsParams() {
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getPoints() {
        return points;
    }

    public void setPoints(Integer points) {
        this.points = points;
    }

}