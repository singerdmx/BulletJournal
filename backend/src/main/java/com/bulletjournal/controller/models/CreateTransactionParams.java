package com.bulletjournal.controller.models;

import java.util.List;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

public class CreateTransactionParams {

    @NotBlank
    @Size(min = 1, max = 100)
    private String name;

    @NotBlank
    @Size(min = 2, max = 100)
    private String payer;

    @NotNull
    private Double amount;

    @NotBlank
    @Size(min = 10, max = 10)
    private String date; // "yyyy-MM-dd"

    private String time; // "hh:mm"

    @NotBlank
    private String timezone;

    @NotNull
    private Integer transactionType;

    private List<Long> labels;

    public CreateTransactionParams() {
    }

    public CreateTransactionParams(@NotBlank @Size(min = 1, max = 100) String name, @NotBlank String payer,
            @NotNull Double amount, @NotBlank @Size(min = 10, max = 10) String date, String time,
            @NotBlank String timezone, @NotNull Integer transactionType) {
        this.name = name;
        this.payer = payer;
        this.amount = amount;
        this.date = date;
        this.time = time;
        this.timezone = timezone;
        this.transactionType = transactionType;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getPayer() {
        return payer;
    }

    public void setPayer(String payer) {
        this.payer = payer;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getTimezone() {
        return this.timezone;
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

    public List<Long> getLabels() {
        return labels;
    }

    public void setLabels(List<Long> labels) {
        this.labels = labels;
    }
}
