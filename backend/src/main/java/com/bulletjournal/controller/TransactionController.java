package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.ledger.TransactionType;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveTransactionEvent;
import com.bulletjournal.notifications.UpdateTransactionPayerEvent;
import com.bulletjournal.repository.TransactionDaoJpa;
import com.bulletjournal.repository.models.TransactionContent;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
public class TransactionController {
    protected static final String TRANSACTIONS_ROUTE = "/api/projects/{projectId}/transactions";
    protected static final String TRANSACTION_ROUTE = "/api/transactions/{transactionId}";
    protected static final String TRANSACTION_SET_LABELS_ROUTE = "/api/transactions/{transactionId}/setLabels";
    protected static final String MOVE_TRANSACTION_ROUTE = "/api/transactions/{transactionId}/move";
    protected static final String SHARE_TRANSACTION_ROUTE = "/api/transactions/{transactionId}/share";
    protected static final String ADD_CONTENT_ROUTE = "/api/transactions/{transactionId}/addContent";
    protected static final String CONTENT_ROUTE = "/api/transactions/{transactionId}/contents/{contentId}";
    protected static final String CONTENTS_ROUTE = "/api/transactions/{transactionId}/contents";
    protected static final String CONTENT_REVISIONS_ROUTE = "/api/transactions/{transactionId}/contents/{contentId}/revisions";

    private static class Transactions {
        double income = 0.0;
        double expense = 0.0;

        public Transactions() {
        }

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


    @Autowired
    private TransactionDaoJpa transactionDaoJpa;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private UserClient userClient;

    @GetMapping(TRANSACTIONS_ROUTE)
    public ResponseEntity<LedgerSummary> getTransactions(
            @NotNull @PathVariable Long projectId,
            @NotNull @RequestParam FrequencyType frequencyType,
            @NotBlank @RequestParam String timezone,
            @NotNull @RequestParam LedgerSummaryType ledgerSummaryType,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {

        Pair<ZonedDateTime, ZonedDateTime> startEndTime = getStartEndTime(frequencyType, timezone, startDate, endDate);
        ZonedDateTime startTime = startEndTime.getLeft();
        ZonedDateTime endTime = startEndTime.getRight();

        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Transaction> transactions = this.transactionDaoJpa.getTransactions(projectId, startTime, endTime, username);

        String transactionsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, transactions);

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(transactionsEtag);


        LedgerSummary ledgerSummary = new LedgerSummary(transactions,
                ZonedDateTimeHelper.getDateString(startTime),
                ZonedDateTimeHelper.getDateString(endTime));

        double totalIncome = 0.0;
        double totalExpense = 0.0;
        Map<String, Transactions> m = new HashMap<>();
        switch (ledgerSummaryType) {
            case DEFAULT:
                break;
            case LABEL:
                break;
            case PAYER:
                // by payer : different user in projects
                for (Transaction t : transactions) {
                    TransactionType transactionType = TransactionType.getType(t.getTransactionType());

                    double amount = t.getAmount();
                    Transactions tran = m.computeIfAbsent(t.getPayer(), k -> new Transactions());
                    switch (transactionType) {
                        case INCOME:
                            totalIncome += amount;
                            tran.addIncome(amount);
                            break;
                        case EXPENSE:
                            totalExpense += amount;
                            tran.addExpense(amount);
                            break;
                    }
                }
                break;
            case TIMELINE:
                break;
            default:
                throw new IllegalArgumentException("Invalid LedgerSummaryType " + ledgerSummaryType);
        }

        ledgerSummary.setIncome(totalIncome);
        ledgerSummary.setExpense(totalExpense);
        ledgerSummary.setBalance(totalIncome - totalExpense);
        List<TransactionsSummary> transactionsSummaries = new ArrayList<>();
        double finalTotalIncome = totalIncome;
        double finalTotalExpense = totalExpense;
        m.forEach((k, v) -> {
            double balance = v.getIncome() - v.getExpense();
            transactionsSummaries.add(new TransactionsSummary(
                    k,
                    null,
                    v.getIncome(),
                    Math.round((v.getIncome() * 100 / finalTotalIncome) * 100.0) / 100.0,
                    v.getExpense(),
                    Math.round(v.getExpense() * 100 / finalTotalExpense * 100.0) / 100.0,
                    balance,
                    balance * 100 / ledgerSummary.getBalance()
            ));
        });
        ledgerSummary.setTransactionsSummaries(transactionsSummaries);

        return ResponseEntity.ok().headers(responseHeader).body(ledgerSummary);
    }

    @PostMapping(TRANSACTIONS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public Transaction createTransaction(@NotNull @PathVariable Long projectId,
                                         @Valid @RequestBody CreateTransactionParams createTransactionParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return transactionDaoJpa.create(projectId, username, createTransactionParams).toPresentationModel();
    }

    @GetMapping(TRANSACTION_ROUTE)
    public Transaction getTransaction(@NotNull @PathVariable Long transactionId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        Transaction transaction = this.transactionDaoJpa.getTransaction(username, transactionId);
        transaction.setOwnerAvatar(this.userClient.getUser(transaction.getOwner()).getAvatar());
        transaction.setPayerAvatar(this.userClient.getUser(transaction.getPayer()).getAvatar());
        return transaction;
    }

    @PatchMapping(TRANSACTION_ROUTE)
    public Transaction updateTransaction(@NotNull @PathVariable Long transactionId,
                                         @Valid @RequestBody UpdateTransactionParams updateTransactionParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = transactionDaoJpa.partialUpdate(username, transactionId, updateTransactionParams);
        if (!events.isEmpty()) {
            notificationService.inform(new UpdateTransactionPayerEvent(events, username, updateTransactionParams.getPayer()));
        }
        return getTransaction(transactionId);
    }

    @DeleteMapping(TRANSACTION_ROUTE)
    public void deleteTransaction(@NotNull @PathVariable Long transactionId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = this.transactionDaoJpa.delete(username, transactionId);
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveTransactionEvent(events, username));
        }
    }

    @PutMapping(TRANSACTION_SET_LABELS_ROUTE)
    public Transaction setLabels(@NotNull @PathVariable Long transactionId,
                                 @NotNull @RequestBody List<Long> labels) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.notificationService.inform(this.transactionDaoJpa.setLabels(username, transactionId, labels));
        return getTransaction(transactionId);
    }

    @PostMapping(MOVE_TRANSACTION_ROUTE)
    public void moveTransaction(@NotNull @PathVariable Long transactionId,
                                @NotNull @RequestBody MoveProjectItemParams moveProjectItemParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.transactionDaoJpa.move(username, transactionId, moveProjectItemParams.getTargetProject());
    }

    @PostMapping(SHARE_TRANSACTION_ROUTE)
    public String shareTransaction(
            @NotNull @PathVariable Long transactionId,
            @NotNull @RequestBody ShareProjectItemParams shareProjectItemParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.transactionDaoJpa.shareProjectItem(transactionId, shareProjectItemParams, username);
        return null; // may be generated link
    }

    private Pair<ZonedDateTime, ZonedDateTime> getStartEndTime(
            FrequencyType frequencyType,
            String timezone,
            String startDate,
            String endDate
    ) {
        ZonedDateTime startTime;
        ZonedDateTime endTime;
        if (StringUtils.isBlank(startDate) || StringUtils.isBlank(endDate)) {
            if (frequencyType == null) {
                throw new BadRequestException("Missing FrequencyType");
            }
            startTime = ZonedDateTimeHelper.getStartTime(frequencyType, timezone);
            endTime = ZonedDateTimeHelper.getEndTime(frequencyType, timezone);
        } else {
            startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
            endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);
        }
        return Pair.of(startTime, endTime);
    }

    @PostMapping(ADD_CONTENT_ROUTE)
    public Content addContent(@NotNull @PathVariable Long transactionId,
                              @NotNull @RequestBody CreateContentParams createContentParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.transactionDaoJpa.addContent(transactionId, username,
                new TransactionContent(createContentParams.getText())).toPresentationModel();
    }

    @GetMapping(CONTENTS_ROUTE)
    public List<Content> getContents(@NotNull @PathVariable Long transactionId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.transactionDaoJpa.getContents(transactionId, username).stream()
                .map(t -> t.toPresentationModel()).collect(Collectors.toList());
    }

    @DeleteMapping(CONTENT_ROUTE)
    public void deleteContent(@NotNull @PathVariable Long transactionId,
                              @NotNull @PathVariable Long contentId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.transactionDaoJpa.deleteContent(contentId, transactionId, username);
    }

    @PatchMapping(CONTENT_ROUTE)
    public void updateContent(@NotNull @PathVariable Long transactionId,
                              @NotNull @PathVariable Long contentId,
                              @NotNull @RequestBody UpdateContentParams updateContentParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.transactionDaoJpa.updateContent(contentId, transactionId, username, updateContentParams);
    }

    @GetMapping(CONTENT_REVISIONS_ROUTE)
    public List<Revision> getContentRevisions(
            @NotNull @PathVariable Long transactionId,
            @NotNull @PathVariable Long contentId) {
        return null;
    }
}
