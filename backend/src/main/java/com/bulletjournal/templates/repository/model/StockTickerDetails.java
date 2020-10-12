package com.bulletjournal.templates.repository.model;

import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "stock_ticker_details", schema = "template")
public class StockTickerDetails {

    private static final Gson GSON = new Gson();

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
        JsonObject json = GSON.fromJson(
                details, JsonObject.class);
        return new com.bulletjournal.templates.controller.model.StockTickerDetails(ticker, details, selection.toPresentationModel(),
                json.get("logo").toString(),
                json.get("country").toString(),
                json.get("industry").toString(),
                json.get("marketcap").getAsLong(),
                json.get("employees").getAsLong(),
                json.get("phone").toString(),
                json.get("ceo").toString(),
                json.get("url").toString(),
                json.get("description").toString(),
                json.get("exchange").toString(),
                json.get("name").toString(),
                json.get("exchangeSymbol").toString(),
                json.get("hq_address").toString(),
                json.get("hq_state").toString(),
                json.get("hq_country").toString(),
                GSON.fromJson(json.get("tags").toString(), String[].class),
                GSON.fromJson(json.get("similar").toString(), String[].class)
        );
    }
}
