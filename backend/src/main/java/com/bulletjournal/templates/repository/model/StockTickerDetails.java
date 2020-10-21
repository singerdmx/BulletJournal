package com.bulletjournal.templates.repository.model;

import com.bulletjournal.templates.controller.model.Choice;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "stock_ticker_details", schema = "template")
public class StockTickerDetails {

    private static final Gson GSON = new Gson();

    @Id
    private String ticker;

    @Column(name = "expiration_time", nullable = false)
    private Timestamp expirationTime;

    @Column(name = "details", nullable = false)
    private String details;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "selection_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Selection selection;

    public StockTickerDetails() {
    }

    public StockTickerDetails(String ticker, String details, Selection selection, Timestamp expirationTime) {
        this.ticker = ticker;
        this.details = details;
        this.selection = selection;
        expirationTime = expirationTime;
    }

    public Timestamp getExpirationTime() {
        return expirationTime;
    }

    public void setExpirationTime(Timestamp expirationTime) {
        this.expirationTime = expirationTime;
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
        if (StringUtils.isBlank(details)) {
            return new com.bulletjournal.templates.controller.model.StockTickerDetails(
                    ticker, details, selection.toPresentationModel());
        }
        JsonObject json = GSON.fromJson(
                details, JsonObject.class);
        Long marketCap = null;
        if (json.has("marketcap")) {
            marketCap = json.get("marketcap").getAsLong();
        }

        return new com.bulletjournal.templates.controller.model.StockTickerDetails(ticker, details, selection.toPresentationModel(),
                json.get("logo").getAsString(),
                json.get("country").getAsString(),
                json.get("industry").getAsString(),
                marketCap,
                json.get("employees").getAsLong(),
                json.get("phone").getAsString(),
                json.get("ceo").getAsString(),
                json.get("url").getAsString(),
                json.get("description").getAsString(),
                json.get("exchange").getAsString(),
                json.get("name").getAsString(),
                json.get("exchangeSymbol").getAsString(),
                json.get("hq_address").getAsString(),
                json.get("hq_state").getAsString(),
                json.get("hq_country").getAsString(),
                GSON.fromJson(json.get("tags").getAsJsonArray(), String[].class),
                GSON.fromJson(json.get("similar").getAsJsonArray(), String[].class)
        );
    }

    public com.bulletjournal.templates.controller.model.StockTickerDetails toPresentationModelWithChoice() {
        com.bulletjournal.templates.controller.model.StockTickerDetails stockTickerDetails = toPresentationModel();
        if (selection != null) {
            stockTickerDetails.getSelection().setChoice(new Choice(selection.getChoice().getId()));
        }
        return stockTickerDetails;
    }

    @Override
    public String toString() {
        return "StockTickerDetails{" +
                "ticker='" + ticker + '\'' +
                ", expirationTime=" + expirationTime +
                ", details='" + details + '\'' +
                ", selection=" + selection +
                '}';
    }
}
