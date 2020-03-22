package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveTransactionEvent;
import com.bulletjournal.notifications.UpdateTransactionPayerEvent;
import com.bulletjournal.repository.TransactionDaoJpa;
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
import java.util.List;

@RestController
public class TransactionController {
    protected static final String TRANSACTIONS_ROUTE = "/api/projects/{projectId}/transactions";
    protected static final String TRANSACTION_ROUTE = "/api/transactions/{transactionId}";
    protected static final String TRANSACTION_SET_LABELS_ROUTE = "/api/transactions/{transactionId}/setLabels";
    protected static final String MOVE_TRANSACTION_ROUTE = "/api/transactions/{transactionId}/move";
    protected static final String SHARE_TRANSACTION_ROUTE = "/api/transactions/{transactionId}/share";

    @Autowired
    private TransactionDaoJpa transactionDaoJpa;

    @Autowired
    private NotificationService notificationService;

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

        List<Transaction> transactions = this.transactionDaoJpa.getTransactions(
                projectId, startTime, endTime);

        String transactionsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, transactions);

        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(transactionsEtag);

        LedgerSummary ledgerSummary = new LedgerSummary(transactions);
        switch (ledgerSummaryType) {
            case DEFAULT:
                break;
            case LABEL:
                break;
            case PAYER:
                break;
            case TIMELINE:
                break;
            default:
                throw new IllegalArgumentException("Invalid LedgerSummaryType " + ledgerSummaryType);
        }

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
        return this.transactionDaoJpa.getTransaction(transactionId);
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
}
