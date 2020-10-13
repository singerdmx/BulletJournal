package com.bulletjournal.templates.repository;

import com.bulletjournal.clients.StockApiClient;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.templates.controller.model.StockTickerDetails;
import com.bulletjournal.templates.repository.model.Selection;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.LinkedHashMap;
import java.util.Optional;

@Repository
public class StockTickerDetailsDaoJpa {

    private static final Gson GSON = new Gson();
    public static final Logger LOGGER = LoggerFactory.getLogger(StockTickerDetailsDaoJpa.class);

    @Autowired
    private StockTickerDetailsRepository stockTickerDetailsRepository;

    @Autowired
    private StockApiClient stockApiClient;

    @Autowired
    private SelectionDaoJpa selectionDaoJpa;

    public StockTickerDetails get(String symbol) {
        Optional<com.bulletjournal.templates.repository.model.StockTickerDetails> stockTickerDetailsOptional =
                this.stockTickerDetailsRepository.findById(symbol);
        if (stockTickerDetailsOptional.isPresent()) {
            return stockTickerDetailsOptional.get().toPresentationModel();
        }

        LinkedHashMap resp = this.stockApiClient.getCompany(symbol);
        com.bulletjournal.templates.repository.model.StockTickerDetails stockTickerDetails =
                new com.bulletjournal.templates.repository.model.StockTickerDetails();
        LOGGER.info(resp.toString());
        stockTickerDetails.setTicker(symbol);
        stockTickerDetails.setDetails(GSON.toJson(resp));
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
        stockTickerDetails.setSelection(selection);
        stockTickerDetailsRepository.save(stockTickerDetails);
        return stockTickerDetails.toPresentationModel();
    }
}
