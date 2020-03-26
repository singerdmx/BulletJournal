package com.bulletjournal.repository.models;

import com.bulletjournal.controller.models.Label;
import com.bulletjournal.ledger.TransactionType;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;
import java.util.Collections;
import java.util.List;

/**
 * This class is for ProjectType.LEDGER
 */
@Entity
@Table(name = "transactions",
        indexes = {
                @Index(name = "transaction_payer_interval_index", columnList = "payer, start_time, end_time"),
                @Index(name = "transaction_project_interval_index", columnList = "project_id, start_time, end_time")})
public class Transaction extends ProjectItemModel {
    @Id
    @GeneratedValue(generator = "transaction_generator")
    @SequenceGenerator(
            name = "transaction_generator",
            sequenceName = "transaction_sequence",
            initialValue = 100
    )
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100)
    private String payer;

    @NotNull
    @Column(nullable = false)
    private Double amount;

    @NotNull
    @Column(nullable = false)
    private TransactionType transactionType;

    @NotBlank
    @Column(nullable = false)
    private String date;

    @Column
    private String time;

    @NotBlank
    @Column(length = 50, nullable = false)
    private String timezone;

    @NotNull
    @Column(name = "start_time", nullable = false)
    private Timestamp startTime;

    @NotNull
    @Column(name = "end_time", nullable = false)
    private Timestamp endTime;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public TransactionType getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(TransactionType transactionType) {
        this.transactionType = transactionType;
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
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
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

    public com.bulletjournal.controller.models.Transaction toPresentationModel() {
        return this.toPresentationModel(Collections.emptyList());
    }

    public com.bulletjournal.controller.models.Transaction toPresentationModel(
            List<Label> labels) {
        return new com.bulletjournal.controller.models.Transaction(
                this.getId(),
                this.getOwner(),
                this.getName(),
                this.getProject(),
                this.getPayer(),
                this.getAmount(),
                this.getDate(),
                this.getTime(),
                this.getTimezone(),
                this.getTransactionType().getValue(),
                labels);
    }
}
