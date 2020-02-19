package com.bulletjournal.repository.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

/**
 * This class is for ProjectType.LEDGER
 */
@Entity
@Table(name = "transactions")
public class Transaction extends ProjectItemModel {
    @Id
    @GeneratedValue(generator = "ledger_generator")
    @SequenceGenerator(
            name = "ledger_generator",
            sequenceName = "ledger_sequence"
    )
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100)
    private String payer;

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
}
