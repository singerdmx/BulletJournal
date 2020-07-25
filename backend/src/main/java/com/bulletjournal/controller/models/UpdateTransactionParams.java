package com.bulletjournal.controller.models;

import org.apache.commons.lang3.StringUtils;

import java.util.List;

public class UpdateTransactionParams {

    private String name;

    private String payer;

    private Double amount;

    private String date;

    private String time;

    private String timezone;

    private Integer transactionType;

    private List<Long> labels;

    public UpdateTransactionParams() {
    }

    public UpdateTransactionParams(String name, String payer, Double amount, String date, String time, String timezone,
            Integer transactionType) {
        this.name = name;
        this.payer = payer;
        this.amount = amount;
        this.date = date;
        this.time = time;
        this.timezone = timezone;
        this.transactionType = transactionType;
    }

    public String getPayer() {
        return payer;
    }

    public void setPayer(String payer) {
        this.payer = payer;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Integer getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(Integer transactionType) {
        this.transactionType = transactionType;
    }

    public boolean hasName() {
        return StringUtils.isNotBlank(this.name);
    }

    public boolean hasPayer() {
        return this.payer != null;
    }

    public boolean hasDate() {
        return this.date != null;
    }

    public boolean hasAmount() {
        return this.amount != null;
    }

    public boolean hasTime() {
        return this.time != null;
    }

    public boolean hasTimezone() {
        return this.timezone != null;
    }

    public boolean hasTransactionType() {
        return this.transactionType != null;
    }

    public boolean needsUpdateDateTime() {
        return this.hasDate() || this.hasTime() || this.hasTimezone();
    }

    public String getOrDefaultDate(String defaultDate) {
        return this.hasDate() ? this.getDate() : defaultDate;
    }

    public String getOrDefaultTime(String defaultTime) {
        return this.hasTime() ? this.getTime() : defaultTime;
    }

    public String getOrDefaultTimezone(String defaultTimezone) {
        return this.hasTimezone() ? this.getTimezone() : defaultTimezone;
    }

    public List<Long> getLabels() {
        return labels;
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels;
    }

    public boolean hasLabels() {
        return this.labels != null;
    }
}