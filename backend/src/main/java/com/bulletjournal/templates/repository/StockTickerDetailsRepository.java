package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.StockTickerDetails;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockTickerDetailsRepository extends JpaRepository<StockTickerDetails, String> {
}