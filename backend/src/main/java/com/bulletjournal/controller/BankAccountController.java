package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.models.params.CreateBankAccountParams;
import com.bulletjournal.controller.models.params.SetBankAccountBalanceParams;
import com.bulletjournal.controller.models.params.UpdateBankAccountParams;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.BankAccountDaoJpa;
import com.bulletjournal.repository.TransactionDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
public class BankAccountController {
    private static final Logger LOGGER = LoggerFactory.getLogger(BankAccountController.class);
    protected static final String BANK_ACCOUNTS_ROUTE = "/api/bankAccounts";
    protected static final String BANK_ACCOUNT_ROUTE = "/api/bankAccounts/{bankAccountId}";
    protected static final String BANK_ACCOUNT_SET_BALANCE_ROUTE = "/api/bankAccounts/{bankAccountId}/setBalance";
    protected static final String BANK_ACCOUNT_TRANSACTIONS_ROUTE = "/api/bankAccounts/{bankAccountId}/transactions";

    @Autowired
    private BankAccountDaoJpa bankAccountDaoJpa;

    @Autowired
    private TransactionDaoJpa transactionDaoJpa;

    @Autowired
    private UserClient userClient;

    @GetMapping(BANK_ACCOUNTS_ROUTE)
    public ResponseEntity<List<BankAccount>> getBankAccounts() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<BankAccount> bankAccounts = this.bankAccountDaoJpa.getBankAccounts(username);

        String bankAccountsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, bankAccounts);
        HttpHeaders responseHeader = new HttpHeaders();
        responseHeader.setETag(bankAccountsEtag);
        return ResponseEntity.ok().headers(responseHeader).body(
                BankAccount.addOwnerAvatar(bankAccounts, this.userClient));
    }

    @PostMapping(BANK_ACCOUNTS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public BankAccount createBankAccount(@Valid @RequestBody CreateBankAccountParams bankAccountParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        BankAccount bankAccount = bankAccountDaoJpa.create(bankAccountParams, username);
        return BankAccount.addOwnerAvatar(bankAccount, this.userClient);
    }

    @PutMapping(BANK_ACCOUNT_ROUTE)
    public BankAccount updateBankAccount(@NotNull @PathVariable Long bankAccountId,
                                         @Valid @RequestBody UpdateBankAccountParams bankAccountParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        return this.bankAccountDaoJpa.update(username, bankAccountId, bankAccountParams);
    }

    @DeleteMapping(BANK_ACCOUNT_ROUTE)
    public void deleteBankAccount(@NotNull @PathVariable Long bankAccountId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);

        this.bankAccountDaoJpa.deleteBankAccount(username, bankAccountId);
    }

    @PostMapping(BANK_ACCOUNT_SET_BALANCE_ROUTE)
    public void setBalance(@NotNull @PathVariable Long bankAccountId,
                           @NotNull @Valid @RequestBody SetBankAccountBalanceParams setBankAccountBalanceParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.bankAccountDaoJpa.setBalance(
                username, bankAccountId,
                setBankAccountBalanceParams.getBalance(),
                setBankAccountBalanceParams.getDescription());
    }

    @GetMapping(BANK_ACCOUNT_TRANSACTIONS_ROUTE)
    public List<Transaction> getTransactions(
            @NotNull @PathVariable Long bankAccountId,
            @NotBlank @RequestParam String timezone,
            @NotBlank @RequestParam String startDate,
            @NotBlank @RequestParam String endDate) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        // Set start time and end time
        ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
        ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);
        return ProjectItem.addAvatar(
                this.transactionDaoJpa.getBankAccountTransactions(bankAccountId, startTime, endTime, username),
                this.userClient);
    }
}
