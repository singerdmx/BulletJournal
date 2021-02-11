package com.bulletjournal.repository.models;

import javax.persistence.*;

@Entity
@Table(name = "transaction_auditables")
public class TransactionAuditable {

    @EmbeddedId
    private TransactionAuditableKey id;

    @ManyToOne
    @MapsId("transaction_id")
    @JoinColumn(name = "transaction_id")
    private Transaction transaction;

    @ManyToOne
    @MapsId("auditable_id")
    @JoinColumn(name = "auditable_id")
    private Auditable auditable;

    public TransactionAuditable() {
    }

    public TransactionAuditableKey getId() {
        return id;
    }

    public void setId(TransactionAuditableKey id) {
        this.id = id;
    }

    public Transaction getTransaction() {
        return transaction;
    }

    public void setTransaction(Transaction transaction) {
        this.transaction = transaction;
    }

    public Auditable getAuditable() {
        return auditable;
    }

    public void setAuditable(Auditable auditable) {
        this.auditable = auditable;
    }
}
