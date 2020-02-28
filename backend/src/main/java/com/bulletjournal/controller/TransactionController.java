package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.CreateTransactionParams;
import com.bulletjournal.controller.models.Transaction;
import com.bulletjournal.controller.models.UpdateTransactionParams;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.notifications.NotificationService;
import com.bulletjournal.notifications.RemoveTransactionEvent;
import com.bulletjournal.repository.TransactionDaoJpa;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.util.List;
import java.util.stream.Collectors;

@RestController
public class TransactionController {
    protected static final String TRANSACTIONS_ROUTE = "/api/projects/{projectId}/transactions";
    protected static final String TRANSACTION_ROUTE = "/api/transactions/{transactionId}";

    @Autowired
    private TransactionDaoJpa transactionDaoJpa;

    @Autowired
    private NotificationService notificationService;

//    @GetMapping(TRANSACTIONS_ROUTE)
//    public List<Transaction> getTransactions(@NotNull @PathVariable Long projectId) {
//        return this.transactionDaoJpa.getTransactions(projectId)
//                .stream()
//                .map(com.bulletjournal.repository.models.Transaction::toPresentationModel)
//                .collect(Collectors.toList());
//    }

    @GetMapping(TRANSACTIONS_ROUTE)
    public List<Transaction> getTransactionsByInterval(@NotNull @PathVariable Long projectId,
                                                       @NotNull @RequestParam Long startTime,
                                                       @NotNull @RequestParam Long endTime) {
        return this.transactionDaoJpa.findTransactionsByProjectInterval(projectId, startTime, endTime)
                .stream()
                .map(com.bulletjournal.repository.models.Transaction::toPresentationModel)
                .collect(Collectors.toList());
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
        return this.transactionDaoJpa.getTransaction(transactionId).toPresentationModel();
    }

    @PatchMapping(TRANSACTION_ROUTE)
    public Transaction updateTransaction(@NotNull @PathVariable Long transactionId,
                                         @Valid @RequestBody UpdateTransactionParams updateTransactionParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return transactionDaoJpa.partialUpdate(username, transactionId, updateTransactionParams).toPresentationModel();
    }

    @DeleteMapping(TRANSACTION_ROUTE)
    public void deleteTransaction(@NotNull @PathVariable Long transactionId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Event> events = this.transactionDaoJpa.delete(username, transactionId);
        if (!events.isEmpty()) {
            this.notificationService.inform(new RemoveTransactionEvent(events, username));
        }
    }
}
