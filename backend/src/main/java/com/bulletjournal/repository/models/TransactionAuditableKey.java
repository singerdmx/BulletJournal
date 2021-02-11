package com.bulletjournal.repository.models;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.validation.constraints.NotNull;
import java.io.Serializable;
import java.util.Objects;

@Embeddable
public class TransactionAuditableKey implements Serializable {

    @NotNull
    @Column(name = "transaction_id")
    private Long transactionId;

    @NotNull
    @Column(name = "auditable_id")
    private Long auditableId;

    public TransactionAuditableKey() {
    }

    public TransactionAuditableKey(@NotNull Long transactionId, @NotNull Long auditableId) {
        this.transactionId = transactionId;
        this.auditableId = auditableId;
    }

    public Long getTransactionId() {
        return transactionId;
    }

    public void setTransactionId(Long transactionId) {
        this.transactionId = transactionId;
    }

    public Long getAuditableId() {
        return auditableId;
    }

    public void setAuditableId(Long auditableId) {
        this.auditableId = auditableId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof TransactionAuditableKey)) return false;
        TransactionAuditableKey that = (TransactionAuditableKey) o;
        return Objects.equals(getTransactionId(), that.getTransactionId()) && Objects.equals(getAuditableId(), that.getAuditableId());
    }

    @Override
    public int hashCode() {
        return Objects.hash(getTransactionId(), getAuditableId());
    }
}
