package com.bulletjournal.templates.repository;

import com.bulletjournal.clients.StockApiClient;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.templates.controller.model.Choice;
import com.bulletjournal.templates.controller.model.StockTickerDetails;
import com.bulletjournal.templates.repository.model.Selection;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.util.LinkedHashMap;
import java.util.Optional;

@Repository
public class StockTickerDetailsDaoJpa {

    private static final Gson GSON = new Gson();
    public static final Logger LOGGER = LoggerFactory.getLogger(StockTickerDetailsDaoJpa.class);

    private static final long MILLS_IN_YEAR = 1000L * 60 * 60 * 24 * 365;

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
            return stockTickerDetailsOptional.get().toPresentationModel();
        }

        LinkedHashMap resp;
        try {
            resp = this.stockApiClient.getCompany(symbol);
        } catch (Exception ex) {
            LOGGER.info("Unable to find StockTickerDetails for {}", symbol);
            LOGGER.error("stockApiClient#getCompany failed", ex);
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
            default:
                throw new BadRequestException("Sector " + sector + " not found");
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
        com.bulletjournal.templates.controller.model.StockTickerDetails res = stockTickerDetails.toPresentationModel();
        res.getSelection().setChoice(new Choice(selection.getChoice().getId()));
        return res;
    }
}
