package com.bulletjournal.templates.repository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

@Repository
public class StockTickerDetailsDaoJpa {
    @Autowired
    private StockTickerDetailsRepository stockTickerDetailsRepository;
}
