package com.bulletjournal.controller.models;

import com.bulletjournal.repository.models.Project;

import javax.validation.constraints.NotNull;
import java.util.Objects;

public class Transaction {
    private Long id;

    @NotNull
    private String name;

    @NotNull
    private Long projectId;

    @NotNull
    private String payer;

    @NotNull
    private Double amount;

    @NotNull
    private String date;

    @NotNull
    private Integer transactionType;

    private String time;

    @NotNull
    private String timezone;

    public Transaction() {
    }

    public Transaction(Long id,
                       @NotNull String name,
                       @NotNull Project project,
                       @NotNull String payer,
                       @NotNull Double amount,
                       @NotNull String date,
                       String time,
                       @NotNull String timezone,
                       @NotNull Integer transactionType) {
        this.id = id;
        this.name = name;
        this.projectId = project.getId();
        this.payer = payer;
        this.amount = amount;
        this.date = date;
        this.time = time;
        this.timezone = timezone;
        this.transactionType = transactionType;
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

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transaction that = (Transaction) o;
        return Objects.equals(id, that.id) &&
                Objects.equals(name, that.name) &&
                Objects.equals(projectId, that.projectId) &&
                Objects.equals(payer, that.payer) &&
                Objects.equals(amount, that.amount) &&
                Objects.equals(date, that.date) &&
                Objects.equals(transactionType, that.transactionType) &&
                Objects.equals(time, that.time) &&
                Objects.equals(timezone, that.timezone);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id, name, projectId, payer, amount, date, transactionType, time, timezone);
    }
}