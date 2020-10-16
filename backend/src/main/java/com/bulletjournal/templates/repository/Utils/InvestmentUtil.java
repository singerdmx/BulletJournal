package com.bulletjournal.templates.repository.Utils;

import com.bulletjournal.templates.controller.model.StockTickerDetails;
import com.google.gson.Gson;
import com.google.gson.JsonObject;

public abstract class InvestmentUtil {
    protected static final Gson GSON = new Gson();
    protected final JsonObject json;

    public InvestmentUtil(String raw) {
        this.json = GSON.fromJson(raw, JsonObject.class);
    }

    public abstract String getContent(StockTickerDetails stockTickerDetails);

    public String getTicker() {
        return json.get("ticker").getAsString();
    }

    public static InvestmentUtil getInstance(String metadata, String raw) {
        switch (metadata) {
            case "INVESTMENT_IPO_RECORD":
                return new IPOUtil(raw);
            default:
                throw new IllegalArgumentException("Invalid metadata " + metadata);
        }
    }
}
