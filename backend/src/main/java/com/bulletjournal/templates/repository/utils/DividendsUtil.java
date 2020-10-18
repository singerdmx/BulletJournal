package com.bulletjournal.templates.repository.utils;

import com.bulletjournal.templates.controller.model.StockTickerDetails;
import org.apache.commons.lang3.tuple.Pair;

public class DividendsUtil extends InvestmentUtil {
    public DividendsUtil(String raw) {
        super(raw);
    }

    private static final String DIVIDENDS_CONTENT_TEMPLATE = "{\"delta\":{\"ops\":" +
            "[{\"attributes\":{\"bold\":true},\"insert\":\"Date\"}," +
            "{\"insert\":\": DIVIDENDS_DATE\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Ticker\"}," +
            "{\"insert\":\": DIVIDENDS_EXCHANGE\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Name\"}," +
            "{\"insert\":\": DIVIDENDS_NAME\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Exchange\"}," +
            "{\"insert\":\": DIVIDENDS_EXCHANGE\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Currency\"}," +
            "{\"insert\":\": DIVIDENDS_CURRENCY\\n\"},{\"attributes\":{\"bold\":true},\"insert\":\"Frequency\"},{\"insert\":\": DIVIDENDS_FREQUENCY\\n\"}" +
            ",{\"attributes\":{\"bold\":true},\"insert\":\"Dividend\"},{\"insert\":\": DIVIDENDS_DIVIDEND\\n\"}" +
            ",{\"attributes\":{\"bold\":true},\"insert\":\"Dividend Type\"},{\"insert\":\": DIVIDENDS_TYPE\\n\"}" +
            ",{\"attributes\":{\"bold\":true},\"insert\":\"Dividend Yield\"},{\"insert\":\": DIVIDENDS_YEILD\\n\"}" +
            ",{\"attributes\":{\"bold\":true},\"insert\":\"Ex Dividend Date\"},{\"insert\":\": DIVIDENDS_EX_DATE\\n\"}" +
            ",{\"attributes\":{\"bold\":true},\"insert\":\"Payable Date\"},{\"insert\":\": DIVIDENDS_PAYABLE_DATE\\n\"}" +
            ",{\"attributes\":{\"bold\":true},\"insert\":\"Record Date\"},{\"insert\":\": DIVIDENDS_RECORD_DATE\\n\"}" +
            "TICKER_DETAILS_DELTA]},\"###html###\":\"<p>" +
            "<strong>Date</strong>: DIVIDENDS_DATE</p>" +
            "<p><strong>Ticker</strong>: DIVIDENDS_TICKER</p>" +
            "<p><strong>Name</strong>: DIVIDENDS_NAME</p>" +
            "<p><strong>Exchange</strong>: DIVIDENDS_EXCHANGE</p>" +
            "<p><strong>Currency</strong>: DIVIDENDS_CURRENCY</p>" +
            "<p><strong>Frequency</strong>: DIVIDENDS_FREQUENCY</p>" +
            "<p><strong>Dividend</strong>: DIVIDENDS_DIVIDEND</p>" +
            "<p><strong>Dividend Type</strong>: DIVIDENDS_TYPE</p>" +
            "<p><strong>Dividend Yield</strong>: DIVIDENDS_YEILD</p>" +
            "<p><strong>Ex Dividend Date</strong>: DIVIDENDS_EX_DATE</p>" +
            "<p><strong>Payable Date</strong>: DIVIDENDS_PAYABLE_DATE</p>" +
            "<p><strong>Record Date</strong>: DIVIDENDS_RECORD_DATE</p>" +
            "TICKER_DETAILS_HTML\"}";

    @Override
    public String getContent(StockTickerDetails stockTickerDetails) {
        Pair<String, String> stockTickerDetailContent = getStockTickerDetailContent(stockTickerDetails);

        return DIVIDENDS_CONTENT_TEMPLATE
                .replace("DIVIDENDS_DATE", this.json.get("date").getAsString())
                .replace("DIVIDENDS_TICKER", this.json.get("ticker").getAsString())
                .replace("DIVIDENDS_NAME", this.json.get("name").getAsString())
                .replace("DIVIDENDS_EXCHANGE", this.json.get("exchange").getAsString())
                .replace("DIVIDENDS_CURRENCY", this.json.get("currency").getAsString())
                .replace("DIVIDENDS_FREQUENCY", this.json.get("frequency").getAsString())
                .replace("DIVIDENDS_DIVIDEND", this.json.get("dividend").getAsString())
                .replace("DIVIDENDS_TYPE", this.json.get("dividend_type").getAsString())
                .replace("DIVIDENDS_YEILD", this.json.get("dividend_yield").getAsString())
                .replace("DIVIDENDS_EX_DATE", this.json.get("ex_dividend_date").getAsString())
                .replace("DIVIDENDS_PAYABLE_DATE", this.json.get("payable_date").getAsString())
                .replace("DIVIDENDS_RECORD_DATE", this.json.get("record_date").getAsString())
                .replace("TICKER_DETAILS_DELTA", stockTickerDetailContent.getLeft())
                .replace("TICKER_DETAILS_HTML", stockTickerDetailContent.getRight());
    }
}
