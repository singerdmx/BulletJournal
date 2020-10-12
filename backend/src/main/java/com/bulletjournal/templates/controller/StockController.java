package com.bulletjournal.templates.controller;

import com.bulletjournal.templates.controller.model.StockTickerDetails;
import com.bulletjournal.templates.repository.StockTickerDetailsDaoJpa;
import com.bulletjournal.templates.repository.StockTickerDetailsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class StockController {
    public static final String STOCK_TICKER_DETAILS_ROUTE = "/api/public/stockTickers";

    @Autowired
    private StockTickerDetailsDaoJpa stockTickerDetailsDaoJpa;
    @Autowired
    private StockTickerDetailsRepository stockTickerDetailsRepository;

    @GetMapping(STOCK_TICKER_DETAILS_ROUTE)
    public List<StockTickerDetails> getAllDetails() {
        List<StockTickerDetails> stockTickerDetails
                = stockTickerDetailsRepository.findAll().stream()
                .map(s -> s.toPresentationModel())
                .collect(Collectors.toList());
        return stockTickerDetails;
    }


}
