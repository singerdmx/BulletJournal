package com.bulletjournal.repository;

import com.bulletjournal.repository.models.BankAccount;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class BankAccountDaoJpa {

    @Autowired
    private BankAccountRepository bankAccountRepository;

    public List<com.bulletjournal.controller.models.BankAccount> getBankAccounts(String requester) {
        List<BankAccount> bankAccounts = this.bankAccountRepository.findAllByOwner(requester);
        return bankAccounts.stream().map(BankAccount::toPresentationModel).collect(Collectors.toList());
    }
}
