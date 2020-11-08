package com.bulletjournal.templates.repository.utils;

import com.bulletjournal.templates.controller.model.StockTickerDetails;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;

public class EarningUtil extends InvestmentUtil {
    public EarningUtil(String raw) {
        super(raw);
    }

    private static final String EARNINGS_CONTENT_TEMPLATE = "{\"delta\":{\"ops\":" +
            "[{\"attributes\":{\"bold\":true},\"insert\":\"Date\"}," +
            "{\"insert\":\": EARNINGS_DATE\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Time\"}," +
            "{\"insert\":\": EARNINGS_TIME\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Ticker\"}," +
            "{\"insert\":\": EARNINGS_TICKER\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Exchange\"}," +
            "{\"insert\":\": EARNINGS_EXCHANGE\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Name\"}," +
            "{\"insert\":\": EARNINGS_NAME\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Period\"}," +
            "{\"insert\":\": EARNINGS_PERIOD_PERIOD\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Period Year\"}," +
            "{\"insert\":\": EARNINGS_PERIOD_YEAR\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Currency\"}," +
            "{\"insert\":\": EARNINGS_CURRENCY\\n\"}EARNINGS_PRIOR_EPS_DELTA EARNINGS_PRIOR_REVENUE_DELTA " +
            "EARNINGS_REVENUE_DELTA EARNINGS_REVENUE_EST_DELTA EARNINGS_REVENUE_SURPRISE_DELTA " +
            "EARNINGS_REVENUE_SURPRISE_PERCENT_DELTA EARNINGS_REVENUE_TYPE_DELTA TICKER_DETAILS_DELTA]},\"###html###\":\"<p>" +
            "<strong>Date</strong>: EARNINGS_DATE</p><p><strong>Time</strong>: EARNINGS_TIME</p>" +
            "<p><strong>Ticker</strong>: EARNINGS_TICKER</p><p><strong>Exchange</strong>: EARNINGS_EXCHANGE</p><p><strong>Name</strong>: EARNINGS_NAME</p><p>" +
            "<strong>Period</strong>: EARNINGS_PERIOD_PERIOD</p><p><strong>Period Year</strong>: EARNINGS_PERIOD_YEAR</p><p><strong>Currency</strong>: EARNINGS_CURRENCY</p>" +
            "EARNINGS_PRIOR_EPS_HTML" +
            "EARNINGS_PRIOR_REVENUE_HTML" +
            "EARNINGS_REVENUE_HTML" +
            "EARNINGS_REVENUE_EST_HTML" +
            "EARNINGS_REVENUE_SURPRISE_HTML" +
            "EARNINGS_REVENUE_SURPRISE_PERCENT_HTML" +
            "EARNINGS_REVENUE_TYPE_HTML" +
            "TICKER_DETAILS_HTML\"}";

    @Override
    public String getContent(StockTickerDetails stockTickerDetails) {
        Pair<String, String> stockTickerDetailContent = getStockTickerDetailContent(stockTickerDetails);
        String priorEpsDelta = "";
        String priorEpsHtml = "";
        //revenue  revenue_est   revenue_surprise revenue_surprise_percent  revenue_type
        String revenueDelta = "";
        String revenueHtml = "";
        String revenueEstDelta = "";
        String revenueEstHtml = "";
        String revenueSurpriseDelta = "";
        String revenueSurpriseHtml = "";
        String revenueSurprisePercentDelta = "";
        String revenueSurprisePercentHtml = "";
        String revenueTypeDelta = "";
        String revenueTypeHtml = "";
        String priorRevenueDelta = "";
        String priorRevenueHtml = "";

        if (this.json.has("eps_prior") && !StringUtils.isBlank(this.json.get("eps_prior").getAsString())) {
            priorEpsDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"Prior EPS: \"}," +
                    "{\"insert\": \"" + this.json.get("eps_prior").getAsString() + "\\n\"}";
            priorEpsHtml = "<p><strong>Prior EPS</strong>: " + this.json.get("eps_prior").getAsString() + "</p>";
        }
        if (this.json.has("revenue_prior") && !StringUtils.isBlank(this.json.get("revenue_prior").getAsString())) {
            priorRevenueDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"Prior Revenue: \"}," +
                    "{\"insert\": \"" + this.json.get("revenue_prior").getAsString() + "\\n\"}";
            priorRevenueHtml = "<p><strong>Prior Revenue</strong>: " + this.json.get("revenue_prior").getAsString() + "</p>";
        }
        if (this.json.has("revenue") && !StringUtils.isBlank(this.json.get("revenue").getAsString())) {
            revenueDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"Revenue: \"}," +
                    "{\"insert\": \"" + this.json.get("revenue").getAsString() + "\\n\"}";
            revenueHtml = "<p><strong>Revenue</strong>: " + this.json.get("revenue").getAsString() + "</p>";
        }
        if (this.json.has("revenue_est") && !StringUtils.isBlank(this.json.get("revenue_est").getAsString())) {
            revenueEstDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"Revenue Est: \"}," +
                    "{\"insert\": \"" + this.json.get("revenue_est").getAsString() + "\\n\"}";
            revenueEstHtml = "<p><strong>Revenue Est</strong>: " + this.json.get("revenue_est").getAsString() + "</p>";
        }
        if (this.json.has("revenue_surprise") && !StringUtils.isBlank(this.json.get("revenue_surprise").getAsString())) {
            revenueSurpriseDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"Revenue Surprise: \"}," +
                    "{\"insert\": \"" + this.json.get("revenue_surprise").getAsString() + "\\n\"}";
            revenueSurpriseHtml = "<p><strong>Revenue Surprise</strong>: " + this.json.get("revenue_surprise").getAsString() + "</p>";
        }
        if (this.json.has("revenue_surprise_percent") && !StringUtils.isBlank(this.json.get("revenue_surprise_percent").getAsString())) {
            revenueSurprisePercentDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"Revenue Surprise Percent: \"}," +
                    "{\"insert\": \"" + this.json.get("revenue_surprise_percent").getAsString() + "\\n\"}";
            revenueSurprisePercentHtml = "<p><strong>Revenue Surprise Percent</strong>: " + this.json.get("revenue_surprise_percent").getAsString() + "</p>";
        }
        if (this.json.has("revenue_type") && !StringUtils.isBlank(this.json.get("revenue_type").getAsString())) {
            revenueTypeDelta = ",{\"attributes\":{\"bold\":true},\"insert\":\"Revenue Type: \"}," +
                    "{\"insert\": \"" + this.json.get("revenue_type").getAsString() + "\\n\"}";
            revenueTypeHtml = "<p><strong>Revenue Type</strong>: " + this.json.get("revenue_type").getAsString() + "</p>";
        }

        return EARNINGS_CONTENT_TEMPLATE
                .replace("EARNINGS_DATE", this.json.get("date").getAsString())
                .replace("EARNINGS_TIME", this.json.get("time").getAsString())
                .replace("EARNINGS_TICKER", this.json.get("ticker").getAsString())
                .replace("EARNINGS_EXCHANGE", this.json.get("exchange").getAsString())
                .replace("EARNINGS_NAME", this.json.get("name").getAsString())
                .replace("EARNINGS_PERIOD_PERIOD", this.json.get("period").getAsString())
                .replace("EARNINGS_PERIOD_YEAR", this.json.get("period_year").getAsString())
                .replace("EARNINGS_CURRENCY", this.json.get("currency").getAsString())
                .replace("EARNINGS_PRIOR_EPS_HTML", priorEpsHtml)
                .replace("EARNINGS_PRIOR_EPS_DELTA", priorEpsDelta)
                .replace("EARNINGS_PRIOR_REVENUE_HTML", priorRevenueHtml)
                .replace("EARNINGS_PRIOR_REVENUE_DELTA", priorRevenueDelta)
                .replace("EARNINGS_REVENUE_HTML", revenueHtml)
                .replace("EARNINGS_REVENUE_DELTA", revenueDelta)
                .replace("EARNINGS_REVENUE_EST_HTML", revenueEstHtml)
                .replace("EARNINGS_REVENUE_EST_DELTA", revenueEstDelta)
                .replace("EARNINGS_REVENUE_SURPRISE_HTML", revenueSurpriseHtml)
                .replace("EARNINGS_REVENUE_SURPRISE_DELTA", revenueSurpriseDelta)
                .replace("EARNINGS_REVENUE_SURPRISE_PERCENT_HTML", revenueSurprisePercentHtml)
                .replace("EARNINGS_REVENUE_SURPRISE_PERCENT_DELTA", revenueSurprisePercentDelta)
                .replace("EARNINGS_REVENUE_TYPE_HTML", revenueTypeHtml)
                .replace("EARNINGS_REVENUE_TYPE_DELTA", revenueTypeDelta)
                .replace("TICKER_DETAILS_DELTA", stockTickerDetailContent.getLeft())
                .replace("TICKER_DETAILS_HTML", stockTickerDetailContent.getRight());
    }
}
