package com.bulletjournal.controller.models;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class Date {

    @NotNull
    private Integer year;

    @NotNull
    @Size(min = 0, max = 11)
    private Integer month;

    @NotNull
    @Size(min = 1, max = 31)
    private Integer day;

    public Date() {
    }

    public Date(@NotNull Integer year,
                @NotNull @Size(min = 0, max = 11) Integer month,
                @NotNull @Size(min = 1, max = 31) Integer day) {
        this.year = year;
        this.month = month;
        this.day = day;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public Integer getMonth() {
        return month;
    }

    public void setMonth(Integer month) {
        this.month = month;
    }

    public Integer getDay() {
        return day;
    }

    public void setDay(Integer day) {
        this.day = day;
    }
}
