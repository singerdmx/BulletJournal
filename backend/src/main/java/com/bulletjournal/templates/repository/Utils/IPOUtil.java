package com.bulletjournal.templates.repository.Utils;

import com.bulletjournal.templates.controller.model.StockTickerDetails;
import org.apache.commons.lang3.StringUtils;

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

        String tickerDetailsDelta = "";
        String tickerDetailsHtml = "";
        if (stockTickerDetails != null) {
            tickerDetailsDelta =
                    ",{\"attributes\":{\"width\":\"72\"},\"insert\":{\"image\":\"" + stockTickerDetails.getLogo() + "\"}},{\"insert\":\"\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Country\"},{\"insert\":\": " + stockTickerDetails.getCountry() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Industry\"},{\"insert\":\": " + stockTickerDetails.getIndustry() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"MarketCap\"},{\"insert\":\": " + stockTickerDetails.getMarketCap() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Employees\"},{\"insert\":\": " + stockTickerDetails.getEmployees() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Phone\"},{\"insert\":\": " + stockTickerDetails.getPhone() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"CEO\"},{\"insert\":\": " + stockTickerDetails.getCeo() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"URL\"},{\"insert\":\": \"},{\"attributes\":{\"a\":\"" + stockTickerDetails.getUrl() + "\"},\"insert\":\"" + stockTickerDetails.getUrl() + "\"},{\"insert\":\"\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Description\"},{\"insert\":\": " + stockTickerDetails.getDescription() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Exchange\"},{\"insert\":\": " + stockTickerDetails.getExchange() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Name\"},{\"insert\":\": " + stockTickerDetails.getName() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"ExchangeSymbol\"},{\"insert\":\": " + stockTickerDetails.getExchangeSymbol() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"HQ Address\"},{\"insert\":\": " + stockTickerDetails.getHqAddress() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"HQ State\"},{\"insert\":\": " + stockTickerDetails.getHqState() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"HQ Country\"},{\"insert\":\": " + stockTickerDetails.getHqCountry() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Tags\"},{\"insert\":\": " + String.join(", ", stockTickerDetails.getTags()) + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Similar\"},{\"insert\":\": " + String.join(", ", stockTickerDetails.getSimilar()) + "\\n\"}";
            tickerDetailsHtml = "<p><img src=\\\"" + stockTickerDetails.getLogo() + "\\\" width=\\\"72\\\"></p>" +
                    "<p><strong>Country</strong>: " + stockTickerDetails.getCountry() + "</p>" +
                    "<p><strong>Industry</strong>: " + stockTickerDetails.getIndustry() + "</p>" +
                    "<p><strong>MarketCap</strong>: " + stockTickerDetails.getMarketCap() + "</p>" +
                    "<p><strong>Employees</strong>: " + stockTickerDetails.getEmployees() + "</p>" +
                    "<p><strong>Phone</strong>: " + stockTickerDetails.getPhone() + "</p>" +
                    "<p><strong>CEO</strong>: " + stockTickerDetails.getCeo() + "</p>" +
                    "<p><strong>URL</strong>: <a href=\\\"" + stockTickerDetails.getUrl() + "\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\">" + stockTickerDetails.getUrl() + "</a></p>" +
                    "<p><strong>Description</strong>: " + stockTickerDetails.getDescription() + "</p>" +
                    "<p><strong>Exchange</strong>: " + stockTickerDetails.getExchange() + "</p>" +
                    "<p><strong>Name</strong>: " + stockTickerDetails.getName() + "</p>" +
                    "<p><strong>ExchangeSymbol</strong>: " + stockTickerDetails.getExchangeSymbol() + "</p>" +
                    "<p><strong>HQ Address</strong>: " + stockTickerDetails.getHqAddress() + "</p>" +
                    "<p><strong>HQ State</strong>: " + stockTickerDetails.getHqState() + "</p>" +
                    "<p><strong>HQ Country</strong>: " + stockTickerDetails.getHqCountry() + "</p>" +
                    "<p><strong>Tags</strong>: " + String.join(", ", stockTickerDetails.getTags()) + "</p>" +
                    "<p><strong>Similar</strong>: " + String.join(", ", stockTickerDetails.getSimilar()) + "</p>";
        }
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
                .replace("TICKER_DETAILS_DELTA", tickerDetailsDelta)
                .replace("TICKER_DETAILS_HTML", tickerDetailsHtml);

    }

}
