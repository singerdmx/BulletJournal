package com.bulletjournal.templates.clients;

import com.bulletjournal.templates.config.StockApiConfig;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpMethod;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.LinkedHashMap;

@Component
public class StockApiClient {
    private final RestTemplate restClient;

    private static final String POLYGON_COMPANY_ROOT_URL = "https://api.polygon.io/v1/meta/symbols/{symbol}/company";

    @Autowired
    private StockApiConfig stockApiConfig;

    public StockApiClient() {
        this.restClient = new RestTemplate();
    }

    public LinkedHashMap getCompany(String symbol) {
        String url = UriComponentsBuilder.fromHttpUrl(
                POLYGON_COMPANY_ROOT_URL)
                .queryParam("apiKey", this.stockApiConfig.getApiKey())
                .buildAndExpand(symbol).toUriString();
        LinkedHashMap resp = this.restClient
                .exchange(url, HttpMethod.GET, null, LinkedHashMap.class).getBody();
        return resp;
    }
}
