package com.bulletjournal.templates.repository.model;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "stock_ticker_details", schema = "template")
public class StockTickerDetails {
    @Id
    private String ticker;

    @Column(columnDefinition = "TEXT")
    private String details;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "selection_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Selection selection;

    public StockTickerDetails() {
    }

    public StockTickerDetails(String ticker, String details, Selection selection) {
        this.ticker = ticker;
        this.details = details;
        this.selection = selection;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getDetails() {
        return details;
    }

    public void setDetails(String details) {
        this.details = details;
    }

    public Selection getSelection() {
        return selection;
    }

    public void setSelection(Selection selection) {
        this.selection = selection;
    }

    public com.bulletjournal.templates.controller.model.StockTickerDetails toPresentationModel() {
        return new com.bulletjournal.templates.controller.model.StockTickerDetails(ticker, details,
                selection.toPresentationModel());
    }
}
