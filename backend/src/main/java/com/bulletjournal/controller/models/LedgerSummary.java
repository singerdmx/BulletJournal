package com.bulletjournal.controller.models;

import java.util.List;

public class LedgerSummary {

    private FrequencyType frequencyType;

    private Double balance;

    private Double income;

    private Double expense;

    private List<TransactionsSummary> transactionsSummaries;

    public FrequencyType getFrequencyType() {
        return frequencyType;
    }

    public void setFrequencyType(FrequencyType frequencyType) {
        this.frequencyType = frequencyType;
    }
}
