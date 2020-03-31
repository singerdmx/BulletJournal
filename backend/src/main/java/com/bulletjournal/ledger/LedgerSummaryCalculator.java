package com.bulletjournal.ledger;

import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.Transaction;
import com.bulletjournal.controller.models.TransactionsSummary;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import org.springframework.stereotype.Component;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Consumer;

@Component
public class LedgerSummaryCalculator {

    public LedgerSummary getLedgerSummary(
            LedgerSummaryType ledgerSummaryType,
            ZonedDateTime startTime, ZonedDateTime endTime, List<Transaction> transactions, FrequencyType frequencyType) {
        final LedgerSummary ledgerSummary = new LedgerSummary(transactions,
                ZonedDateTimeHelper.getDate(startTime),
                ZonedDateTimeHelper.getDate(endTime));

        final Total total = new Total();
        Map<String, Transactions> m = new HashMap<>();
        switch (ledgerSummaryType) {
            case DEFAULT:

                switch (frequencyType) {
                    case MONTHLY:
                        // transactions, month
                        Map<Transaction, String> transactionMonthMap = new HashMap<>();
//                        int startmonth = startTime.getMonthValue();
//                        int endmonth = endTime.getMonthValue();
                        for (Transaction t : transactions) {
                            String month = t.getDate().substring(5, 7);
                            transactionMonthMap.put(t, month);
                        }

                        processTransaction(transactions, total, (t -> {
                            double amount = t.getAmount();
                            Transactions tran = m.computeIfAbsent(transactionMonthMap.get(t), k -> new Transactions());
                            switch (TransactionType.getType(t.getTransactionType())) {
                                case INCOME:
                                    tran.addIncome(amount);
                                    break;
                                case EXPENSE:
                                    tran.addExpense(amount);
                                    break;
                            }
                        }));
                        break;
                    case YEARLY:
                        break;
                    case WEEKLY:
                        break;
                }


                break;
            case LABEL:
                processTransaction(transactions, total, (t -> {
                    double amount = t.getAmount();
                    for (Label l : t.getLabels()) {
                        Transactions tran = m.computeIfAbsent(l.getValue(), k -> new Transactions());
                        switch (TransactionType.getType(t.getTransactionType())) {
                            case INCOME:
                                tran.addIncome(amount);
                                break;
                            case EXPENSE:
                                tran.addExpense(amount);
                                break;
                        }
                    }
                }));
                break;
            case PAYER:
                processTransaction(transactions, total, (t -> {
                    Transactions tran = m.computeIfAbsent(t.getPayer(), k -> new Transactions());
                    double amount = t.getAmount();
                    switch (TransactionType.getType(t.getTransactionType())) {
                        case INCOME:
                            tran.addIncome(amount);
                            break;
                        case EXPENSE:
                            tran.addExpense(amount);
                            break;
                    }
                }));
                break;
            case TIMELINE:
                break;
            default:
                throw new IllegalArgumentException("Invalid LedgerSummaryType " + ledgerSummaryType);
        }

        ledgerSummary.setIncome(total.totalIncome);
        ledgerSummary.setExpense(total.totalExpense);
        ledgerSummary.setBalance(total.totalIncome - total.totalExpense);
        final List<TransactionsSummary> transactionsSummaries = new ArrayList<>();
        m.forEach((k, v) -> {
            double balance = v.getIncome() - v.getExpense();
            transactionsSummaries.add(new TransactionsSummary(
                    k,
                    null,
                    v.getIncome(),
                    Math.round((v.getIncome() * 100 / total.totalIncome) * 100.0) / 100.0,
                    v.getExpense(),
                    Math.round(v.getExpense() * 100 / total.totalExpense * 100.0) / 100.0,
                    balance,
                    Math.round(balance * 100 / ledgerSummary.getBalance() * 100.0) / 100.0
            ));
        });
        ledgerSummary.setTransactionsSummaries(transactionsSummaries);
        return ledgerSummary;
    }

    private void processTransaction(List<Transaction> transactions, Total total,
                                    Consumer<Transaction> transactionHandler) {
        for (Transaction t : transactions) {
            transactionHandler.accept(t);
            TransactionType transactionType = TransactionType.getType(t.getTransactionType());
            double amount = t.getAmount();

            switch (transactionType) {
                case INCOME:
                    total.totalIncome += amount;
                    break;
                case EXPENSE:
                    total.totalExpense += amount;
                    break;
            }
        }
    }

    private static class Transactions {
        double income = 0.0;
        double expense = 0.0;

        void addIncome(double amount) {
            this.income += amount;
        }

        void addExpense(double amount) {
            this.expense += amount;
        }

        public double getIncome() {
            return income;
        }

        public double getExpense() {
            return expense;
        }
    }

    private static class Total {
        double totalIncome = 0.0;
        double totalExpense = 0.0;
    }
}
