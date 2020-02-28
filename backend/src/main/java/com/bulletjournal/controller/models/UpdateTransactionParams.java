package com.bulletjournal.controller.models;

import java.sql.Timestamp;

public class UpdateTransactionParams {

    private String name;

    private String payer;

    private Double amount;

    private String date;

    private String time;

    private String timezone;

    private Timestamp startTime;

    private Timestamp endTime;

    private Integer transactionType;

    public UpdateTransactionParams(String name,
                                   String payer,
                                   Double amount,
                                   String date,
                                   String time,
                                   String timezone,
                                   Timestamp startTime,
                                   Timestamp endTime,
                                   Integer transactionType) {
        this.name = name;
        this.payer = payer;
        this.amount = amount;
        this.date = date;
        this.time = time;
        this.timezone = timezone;
        this.startTime = startTime;
        this.endTime = endTime;
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

    public String getTimeZone() {
        return timezone;
    }

    public void setTimeZone(String timeZone) {
        this.timezone = timeZone;
    }

    public Timestamp getStartTime() {
        return startTime;
    }

    public void setStartTime(Timestamp startTime) {
        this.startTime = startTime;
    }

    public Timestamp getEndTime() {
        return endTime;
    }

    public void setEndTime(Timestamp endTime) {
        this.endTime = endTime;
    }

    public Integer getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(Integer transactionType) {
        this.transactionType = transactionType;
    }

    public boolean hasName() {
        return this.name != null;
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

    public boolean hasStartTime() {
        return this.startTime != null;
    }

    public boolean hasEndTime() {
        return this.endTime != null;
    }

    public boolean hasTransactionType() {
        return this.transactionType != null;
    }
}