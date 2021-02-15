package com.bulletjournal.repository.models;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.ledger.TransactionType;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.slf4j.MDC;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.sql.Timestamp;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

/**
 * This class is for ProjectType.LEDGER
 */
@Entity
@Table(name = "transactions")
public class Transaction extends ProjectItemModel<com.bulletjournal.controller.models.Transaction> {
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

    @Column
    private String date;

    @Column
    private String time;

    @NotBlank
    @Column(length = 50, nullable = false)
    private String timezone;

    @Column(name = "start_time")
    private Timestamp startTime;

    @Column(name = "end_time")
    private Timestamp endTime;

    @Column
    private String color;

    @Column(name = "recurrence_rule")
    private String recurrenceRule;

    @Column(name = "deleted_slots", columnDefinition = "TEXT")
    private String deletedSlots;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_account")
    @OnDelete(action = OnDeleteAction.CASCADE)
    private BankAccount bankAccount;

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

    public boolean hasDate() {
        return StringUtils.isNotBlank(this.date);
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

    public String getColor() {
        return color;
    }

    public void setColor(String color) {
        this.color = color;
    }

    public String getRecurrenceRule() {
        return recurrenceRule;
    }

    public void setRecurrenceRule(String recurrenceRule) {
        this.recurrenceRule = recurrenceRule;
    }

    public boolean hasRecurrenceRule() {
        return StringUtils.isNotBlank(this.recurrenceRule);
    }

    public String getDeletedSlots() {
        return deletedSlots;
    }

    public void setDeletedSlots(String deletedSlots) {
        this.deletedSlots = deletedSlots;
    }

    public BankAccount getBankAccount() {
        return bankAccount;
    }

    public void setBankAccount(BankAccount bankAccount) {
        this.bankAccount = bankAccount;
    }

    public boolean hasBankAccount() {
        return this.bankAccount != null;
    }

    public double getNetAmount() {
        double amount = this.getAmount();
        if (this.getTransactionType() == TransactionType.EXPENSE) {
            amount = -amount;
        }

        return amount;
    }

    @Override
    public Object clone() throws CloneNotSupportedException {
        return super.clone();
    }

    @Override
    public com.bulletjournal.controller.models.Transaction toPresentationModel() {
        return this.toPresentationModel(this.getLabels().stream()
                .map(Label::new)
                .collect(Collectors.toList()));
    }

    @Override
    public com.bulletjournal.controller.models.Transaction toPresentationModel(List<Label> labels) {
        return new com.bulletjournal.controller.models.Transaction(
                this.getId(),
                new User(this.getOwner()),
                this.getName(),
                this.getProject(),
                new User(this.getPayer()),
                this.getAmount(),
                this.getDate(),
                this.getTime(),
                this.getTimezone(),
                this.getTransactionType().getValue(),
                this.getCreatedAt().getTime(),
                this.getUpdatedAt().getTime(),
                labels,
                this.getLocation(),
                this.getColor(),
                this.getRecurrenceRule(),
                this.hasBankAccount() && Objects.equals(
                        this.getBankAccount().getOwner(), MDC.get(UserClient.USER_NAME_KEY)) ?
                        this.getBankAccount().toPresentationModel() : null);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TRANSACTION;
    }
}
