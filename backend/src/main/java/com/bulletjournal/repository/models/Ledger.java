package com.bulletjournal.repository.models;

import javax.persistence.*;

/**
 * This class is for ProjectType.LEDGER
 * {@link ProjectItemModel#owner} is "who paid the bill"
 */
@Entity
@Table(name = "ledgers")
public class Ledger extends ProjectItemModel {
    @Id
    @GeneratedValue(generator = "ledger_generator")
    @SequenceGenerator(
            name = "ledger_generator",
            sequenceName = "ledger_sequence"
    )
    private Long id;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }
}
