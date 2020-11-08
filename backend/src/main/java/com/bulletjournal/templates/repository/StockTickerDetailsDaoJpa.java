package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.clients.StockApiClient;
import com.bulletjournal.templates.controller.model.StockTickerDetails;
import com.bulletjournal.templates.repository.model.Selection;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.*;

@Repository
public class StockTickerDetailsDaoJpa {

    private static final Gson GSON = new Gson();
    public static final Logger LOGGER = LoggerFactory.getLogger(StockTickerDetailsDaoJpa.class);

    public static Map<Long, List<String>> SECTOR_KEYWORD = new HashMap<>();

    static {
        SECTOR_KEYWORD.put(254L, ImmutableList.of("bank", "acquisition", "capita", "financial"));
        SECTOR_KEYWORD.put(255L, ImmutableList.of("pharmaceutical", "medicine",
                "bio", "health", "therapeutic", "lifescience"));
        SECTOR_KEYWORD.put(259L, ImmutableList.of("real estate"));
        SECTOR_KEYWORD.put(252L, ImmutableList.of("education"));
        SECTOR_KEYWORD.put(260L, ImmutableList.of("utility", "utilities"));
        SECTOR_KEYWORD.put(253L, ImmutableList.of("petroleum", "energy"));
    }

    public static final long MILLS_IN_YEAR = 1000L * 60 * 60 * 24 * 365;

    @Autowired
    private StockTickerDetailsRepository stockTickerDetailsRepository;

    @Autowired
    private StockApiClient stockApiClient;

    @Autowired
    private SelectionDaoJpa selectionDaoJpa;

    public StockTickerDetails get(String symbol) {
        Optional<com.bulletjournal.templates.repository.model.StockTickerDetails> stockTickerDetailsOptional =
                this.stockTickerDetailsRepository.findById(symbol);
        if (stockTickerDetailsOptional.isPresent() && stockTickerDetailsOptional.get().
                getExpirationTime().after(new Timestamp(System.currentTimeMillis()))) {
            return stockTickerDetailsOptional.get().toPresentationModelWithChoice();
        }

        LinkedHashMap resp;
        try {
            resp = this.stockApiClient.getCompany(symbol);
        } catch (Exception ex) {
            LOGGER.info("Unable to find StockTickerDetails for {}", symbol);
            // LOGGER.error("stockApiClient#getCompany failed", ex);
            return null;
        }

        LOGGER.info(resp.toString());
        String sector = (String) resp.get("sector");
        Long selectionId;
        switch (sector.toLowerCase()) {
            case "technology": //GOOG
                selectionId = 257L;
                break;
            case "communication service": // CMCSA
            case "communication services":
                selectionId = 250L;
                break;
            case "healthcare": // CBLI
                selectionId = 255L;
                break;
            case "consumer defensive": //WMT
                selectionId = 252L;
                break;
            case "consumer cyclical": //MCD
                selectionId = 251L;
                break;
            case "real estate"://RDFN
                selectionId = 259L;
                break;
            case "energy": //CVX
                selectionId = 253L;
                break;
            case "basic materials"://STLD
                selectionId = 258L;
                break;
            case "industrials": //HON
                selectionId = 256L;
                break;
            case "financial services": //JPM
                selectionId = 254L;
                break;
            case "utilities":
                selectionId = 260L;
                break;
            default:
                LOGGER.error("Sector {} not found. Unable to find StockTickerDetails for {}", sector, symbol);
                return null;
        }
        Selection selection = this.selectionDaoJpa.getById(selectionId);

        com.bulletjournal.templates.repository.model.StockTickerDetails stockTickerDetails =
                stockTickerDetailsOptional.isPresent() ? stockTickerDetailsOptional.get() :
                        new com.bulletjournal.templates.repository.model.StockTickerDetails();
        stockTickerDetails.setSelection(selection);
        stockTickerDetails.setExpirationTime(new Timestamp(System.currentTimeMillis() + MILLS_IN_YEAR));
        stockTickerDetails.setDetails(GSON.toJson(resp));
        stockTickerDetails.setTicker(symbol);
        stockTickerDetails = stockTickerDetailsRepository.save(stockTickerDetails);
        return stockTickerDetails.toPresentationModelWithChoice();
    }

}
