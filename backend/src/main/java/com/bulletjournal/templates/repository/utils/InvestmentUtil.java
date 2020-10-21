package com.bulletjournal.templates.repository.utils;

import com.bulletjournal.templates.controller.model.StockTickerDetails;
import com.bulletjournal.templates.repository.model.SampleTask;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
import com.google.gson.JsonObject;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;

import java.util.List;

public abstract class InvestmentUtil {
    protected static final Gson GSON = new Gson();
    protected final JsonObject json;

    private static List<String> INVESTMENT_METADATA = ImmutableList.of(
            "INVESTMENT_IPO_RECORD", "INVESTMENT_EARNINGS_RECORD", "INVESTMENT_DIVIDENDS_RECORD");

    public InvestmentUtil(String raw) {
        this.json = GSON.fromJson(raw, JsonObject.class);
    }

    public abstract String getContent(StockTickerDetails stockTickerDetails);

    public String getTicker() {
        return json.get("ticker").getAsString();
    }

    public static boolean isInvestmentSampleTask(SampleTask sampleTask) {
        return INVESTMENT_METADATA.stream().anyMatch(m -> sampleTask.getMetadata().contains(m));
    }

    public static String getCategoryNameKeyword(String metadata) {
        if (metadata.contains("INVESTMENT_IPO_RECORD")) {
            return "ipo";
        }
        if (metadata.contains("INVESTMENT_EARNINGS_RECORD")) {
            return "earning";
        }
        if (metadata.contains("INVESTMENT_DIVIDENDS_RECORD")) {
            return "dividend";
        }
        throw new IllegalArgumentException("Invalid metadata " + metadata);
    }

    public String getExchange() {
        if (!json.has("exchange")) {
            return null;
        }
        String exchange = json.get("exchange").getAsString();
        return exchange;
    }

    public static InvestmentUtil getInstance(String metadata, String raw) {
        if (metadata.contains("INVESTMENT_IPO_RECORD")) {
            return new IPOUtil(raw);
        }
        if (metadata.contains("INVESTMENT_EARNINGS_RECORD")) {
            return new EarningUtil(raw);
        }
        if (metadata.contains("INVESTMENT_DIVIDENDS_RECORD")) {
            return new DividendsUtil(raw);
        }
        throw new IllegalArgumentException("Invalid metadata " + metadata);
    }

    protected Pair<String, String> getStockTickerDetailContent(StockTickerDetails stockTickerDetails) {
        if (stockTickerDetails != null && StringUtils.isBlank(stockTickerDetails.getDetails())) {
            return Pair.of("", "");
        }
        String tickerDetailsDelta = "";
        String marketCapDelta = "";
        String marketCapHtml = "";
        String tickerDetailsHtml = "";
        if (stockTickerDetails.getMarketCap() != null) {
            marketCapDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"MarketCap\"},{\"insert\":\": " + stockTickerDetails.getMarketCap() + "\\n\"}";
            marketCapHtml = "<p><strong>MarketCap</strong>: " + stockTickerDetails.getMarketCap() + "</p>";
        }
        if (stockTickerDetails != null) {
            tickerDetailsDelta =
                    ",{\"attributes\":{\"width\":\"72\"},\"insert\":{\"image\":\"" + stockTickerDetails.getLogo() + "\"}},{\"insert\":\"\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Country\"},{\"insert\":\": " + stockTickerDetails.getCountry() + "\\n\"}" +
                            ",{\"attributes\":{\"bold\":true},\"insert\":\"Industry\"},{\"insert\":\": " + stockTickerDetails.getIndustry() + "\\n\"}" +
                            "MARKET_CAP_DELTA" +
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
                    "MARKET_CAP_HTML" +
                    "<p><strong>Employees</strong>: " + stockTickerDetails.getEmployees() + "</p>" +
                    "<p><strong>Phone</strong>: " + stockTickerDetails.getPhone() + "</p>" +
                    "<p><strong>CEO</strong>: " + stockTickerDetails.getCeo() + "</p>" +
                    "<p><strong>URL</strong>: <a href=\\\"" + stockTickerDetails.getUrl() + "\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\">" + stockTickerDetails.getUrl() + "</a></p>" +
                    "<p><strong>Description</strong>: " + stockTickerDetails.getDescription() + "</p>" +
                    "<p><strong>Exchange</strong>: " + stockTickerDetails.getExchange() + "</p>" +
                    "<p><strong>Name</strong>: " + stockTickerDetails.getName() + "</p>" +
                    "<p><strong>Exchange Symbol</strong>: " + stockTickerDetails.getExchangeSymbol() + "</p>" +
                    "<p><strong>HQ Address</strong>: " + stockTickerDetails.getHqAddress() + "</p>" +
                    "<p><strong>HQ State</strong>: " + stockTickerDetails.getHqState() + "</p>" +
                    "<p><strong>HQ Country</strong>: " + stockTickerDetails.getHqCountry() + "</p>" +
                    "<p><strong>Tags</strong>: " + String.join(", ", stockTickerDetails.getTags()) + "</p>" +
                    "<p><strong>Similar</strong>: " + String.join(", ", stockTickerDetails.getSimilar()) + "</p>";
        }
        return Pair.of(tickerDetailsDelta.replace("MARKET_CAP_DELTA", marketCapDelta), tickerDetailsHtml.replace("MARKET_CAP_HTML", marketCapHtml));
    }
}
