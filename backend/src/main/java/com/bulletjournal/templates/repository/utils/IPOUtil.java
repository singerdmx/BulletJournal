package com.bulletjournal.templates.repository.utils;

import com.bulletjournal.templates.controller.model.StockTickerDetails;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;

public class IPOUtil extends InvestmentUtil {

    private static final String CONTENT_TEMPLATE = "{\"delta\":{\"ops\":" +
            "[{\"attributes\":{\"bold\":true},\"insert\":\"Date\"}," +
            "{\"insert\":\": IPO_DATE\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Time\"}," +
            "{\"insert\":\": IPO_TIME\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Ticker\"}," +
            "{\"insert\":\": IPO_TICKER\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Exchange\"}," +
            "{\"insert\":\": IPO_EXCHANGE\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Name\"}," +
            "{\"insert\":\": IPO_NAME\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Pricing Date\"}," +
            "{\"insert\":\": IPO_PRICING_DATE\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Currency\"}," +
            "{\"insert\":\": IPO_CURRENCY\\n\"}IPO_PRICE_RANGE_DELTA,{\"attributes\":{\"bold\":true},\"insert\":\"Offering Shares\"}," +
            "{\"insert\":\": IPO_SHARES\\n\"}IPO_LEAD_UNDERWRITERS_DELTA TICKER_DETAILS_DELTA]},\"###html###\":\"<p>" +
            "<strong>Date</strong>: IPO_DATE</p><p><strong>Time</strong>: IPO_TIME</p>" +
            "<p><strong>Ticker</strong>: IPO_TICKER</p><p><strong>Exchange</strong>: IPO_EXCHANGE</p><p><strong>Name</strong>: IPO_NAME</p><p>" +
            "<strong>Pricing Date</strong>: IPO_PRICING_DATE</p><p><strong>Currency</strong>: IPO_CURRENCY</p>IPO_PRICE_RANGE_HTML" +
            "<p><strong>Offering Shares</strong>: IPO_SHARES</p>IPO_LEAD_UNDERWRITERS_HTML TICKER_DETAILS_HTML\"}";

    public IPOUtil(String raw) {
        super(raw);
    }

    @Override
    public String getContent(StockTickerDetails stockTickerDetails) {
        String leadUnderwritersDelta = "";
        String leadUnderwritersHtml = "";
        if (this.json.has("lead_underwriters") && this.json.get("lead_underwriters").getAsJsonArray().size() > 0) {
            leadUnderwritersDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"Lead Underwriters: \"}," +
                    "{\"insert\": \"" + StringUtil.toArrayString(this.json, "lead_underwriters") + "\\n\"}";
            leadUnderwritersHtml = "<p><strong>Lead Underwriters</strong>: " + StringUtil.toArrayString(this.json, "lead_underwriters") + "</p>";
        }
        String updatedContentTemplate;
        if (StringUtils.isBlank(this.json.get("price_min").getAsString()) || StringUtils.isBlank(this.json.get("price_max").getAsString())) {
            updatedContentTemplate = CONTENT_TEMPLATE.replace("IPO_PRICE_RANGE_DELTA", "").
                    replace("IPO_PRICE_RANGE_HTML", "");
        } else if (!this.json.get("price_min").getAsString().equals(this.json.get("price_min").getAsString())) {
            String priceRangeMinMax = ",{\"attributes\":{\"bold\":true},\"insert\":\"Price Range\"},{\"insert\":\": " + this.json.get("price_min").getAsString()
                    + " - " + this.json.get("price_max") + "\\n\"}";
            String priceRangeMinMaxHtml = "<p><strong>Price Range</strong>: " + this.json.get("price_min").getAsString() + " - " + this.json.get("price_max") + "</p>";
            updatedContentTemplate = CONTENT_TEMPLATE.replace("IPO_PRICE_RANGE_DELTA", priceRangeMinMax)
                    .replace("IPO_PRICE_RANGE_HTML", priceRangeMinMaxHtml);
        } else {
            String priceRangeForOne = ",{\"attributes\":{\"bold\":true},\"insert\":\"Price Range\"},{\"insert\":\": " + this.json.get("price_min").getAsString() + "\\n\"}";
            String priceRangeForOneHtml = "<p><strong>Price Range</strong>: " + this.json.get("price_min").getAsString() + "</p>";
            updatedContentTemplate = CONTENT_TEMPLATE.replace("IPO_PRICE_RANGE_DELTA", priceRangeForOne)
                    .replace("IPO_PRICE_RANGE_HTML", priceRangeForOneHtml);
        }

        Pair<String, String> stockTickerDetailContent = getStockTickerDetailContent(stockTickerDetails);
        return updatedContentTemplate
                .replace("IPO_DATE", this.json.get("date").getAsString())
                .replace("IPO_TIME", this.json.get("time").getAsString())
                .replace("IPO_TICKER", this.json.get("ticker").getAsString())
                .replace("IPO_EXCHANGE", this.json.get("exchange").getAsString())
                .replace("IPO_NAME", this.json.get("name").getAsString())
                .replace("IPO_PRICING_DATE", this.json.get("pricing_date").getAsString())
                .replace("IPO_CURRENCY", this.json.get("currency").getAsString())
                .replace("IPO_SHARES", this.json.get("offering_shares").getAsString())
                .replace("IPO_LEAD_UNDERWRITERS_HTML", leadUnderwritersHtml)
                .replace("IPO_LEAD_UNDERWRITERS_DELTA", leadUnderwritersDelta)
                .replace("TICKER_DETAILS_DELTA", stockTickerDetailContent.getLeft())
                .replace("TICKER_DETAILS_HTML", stockTickerDetailContent.getRight());

    }

}
