package com.bulletjournal.templates.controller.model;

public class StockTickerDetails {
    private String ticker;
    private String details;
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
}
