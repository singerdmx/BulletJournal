package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.BankAccount;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.repository.BankAccountDaoJpa;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
public class BankAccountController {
    private static final Logger LOGGER = LoggerFactory.getLogger(BankAccountController.class);
    protected static final String BANK_ACCOUNTS_ROUTE = "/api/bankAccounts";

    @Autowired
    private BankAccountDaoJpa bankAccountDaoJpa;

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
}
