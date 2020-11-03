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
        Long employees = null;
        if (json.has("employees")) {
            employees = json.get("employees").getAsLong();
        }
        String hqState = null;
        if (json.has("hq_state")) {
            hqState = json.get("hq_state").getAsString();
        }
        String phone = null;
        if (json.has("phone")) {
            phone = json.get("phone").getAsString();
        }
        String logo = null;
        if (json.has("logo")) {
            logo = json.get("logo").getAsString();
        }
        String country = null;
        if (json.has("country")) {
            country = json.get("country").getAsString();
        }
        String exchangeSymbol = null;
        if (json.has("exchangeSymbol")) {
            exchangeSymbol = json.get("exchangeSymbol").getAsString();
        }
        String hqAddress = null;
        if (json.has("hq_address")) {
            hqAddress = json.get("hq_address").getAsString();
        }
        String hqCountry = null;
        if (json.has("hq_country")) {
            hqCountry = json.get("hq_country").getAsString();
        }

        return new com.bulletjournal.templates.controller.model.StockTickerDetails(ticker, details, selection.toPresentationModel(),
                logo,
                country,
                json.get("industry").getAsString(),
                marketCap,
                employees,
                phone,
                json.get("ceo").getAsString(),
                json.get("url").getAsString(),
                json.get("description").getAsString(),
                json.get("exchange").getAsString(),
                json.get("name").getAsString(),
                exchangeSymbol,
                hqAddress,
                hqState,
                hqCountry,
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
