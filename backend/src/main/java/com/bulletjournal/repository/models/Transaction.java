package com.bulletjournal.repository.models;

import com.bulletjournal.ledger.TransactionType;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

/**
 * This class is for ProjectType.LEDGER
 */
@Entity
@Table(name = "transactions")
public class Transaction extends ProjectItemModel {
    @Id
    @GeneratedValue(generator = "transaction_generator")
    @SequenceGenerator(
            name = "transaction_generator",
            sequenceName = "transaction_sequence"
    )
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100)
    private String payer;

    @NotNull
    @Column
    private Double amount;

    @NotNull
    @Column
    private TransactionType transactionType;

    @NotNull
    @Column
    private String date;

    @Column
    private String time;

    @NotBlank
    @Column(length = 50, nullable = false)
    private String timezone;

    @NotNull
    @Column
    private Timestamp startTime;

    @NotNull
    @Column
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

    public void setAmount(Double amount) { this.amount = amount; }

    public TransactionType getTransactionType() { return transactionType; }

    public void setTransactionType(TransactionType transactionType) { this.transactionType = transactionType; }

    public String getDate() { return date; }

    public void setDate(String date) { this.date = date; }

    public String getTime() { return time; }

    public void setTime(String time) { this.time = time; }

    public String getTimezone() { return timezone; }

    public void setTimezone(String timezone) { this.timezone = timezone; }

    public Timestamp getStartTime() { return startTime; }

    public void setStartTime(Timestamp startTime) { this.startTime = startTime; }

    public Timestamp getEndTime() { return endTime; }

    public void setEndTime(Timestamp endTime) { this.endTime = endTime; }

    public com.bulletjournal.controller.models.Transaction toPresentationModel() {
        return new com.bulletjournal.controller.models.Transaction(
                this.getId(),
                this.getName(),
                this.getProject(),
                this.getPayer(),
                this.getAmount(),
                this.getDate(),
                this.getTime(),
                this.getTimezone(),
                this.getStartTime(),
                this.getEndTime(),
                this.getTransactionType().getValue());
    }
}
