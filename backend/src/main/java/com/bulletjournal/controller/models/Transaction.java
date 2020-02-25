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

    public Transaction() {
    }

    public Transaction(Long id,
                       @NotNull String name,
                       @NotNull Project project,
                       @NotNull String payer,
                       @NotNull Double amount,
                       @NotNull String date,
                       @NotNull Integer transactionType) {
        this.id = id;
        this.name = name;
        this.projectId = project.getId();
        this.payer = payer;
        this.amount = amount;
        this.date = date;
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

    public Integer getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(Integer transactionType) {
        this.transactionType = transactionType;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Transaction)) return false;
        Transaction that = (Transaction) o;
        return Objects.equals(getId(), that.getId()) &&
                Objects.equals(getName(), that.getName()) &&
                Objects.equals(getProjectId(), that.getProjectId()) &&
                Objects.equals(getPayer(), that.getPayer()) &&
                Objects.equals(getAmount(), that.getAmount()) &&
                getTransactionType() == that.getTransactionType() &&
                Objects.equals(getDate(), that.getDate());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getId(), getName(), getProjectId(), getPayer(), getAmount(), getTransactionType(), getDate());
    }
}