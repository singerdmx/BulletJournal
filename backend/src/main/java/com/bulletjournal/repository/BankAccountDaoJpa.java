package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.*;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.models.BankAccount;
import com.bulletjournal.repository.utils.DaoHelper;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class BankAccountDaoJpa {

    @Autowired
    private BankAccountRepository bankAccountRepository;
    @Autowired
    private AuthorizationService authorizationService;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.BankAccount> getBankAccounts(String requester) {
        List<BankAccount> bankAccounts = this.bankAccountRepository.findAllByOwner(requester);
        return bankAccounts.stream().map(BankAccount::toPresentationModel).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BankAccount getBankAccount(String requester, Long bankAccountId) {
        if (bankAccountId == null) {
            return null;
        }
        BankAccount bankAccount = this.bankAccountRepository.findById(bankAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank Account " + bankAccountId + " not found"));
        if (!bankAccount.getOwner().equals(requester)) {
            throw new UnAuthorizedException("Only owner " + bankAccount.getOwner() + " can get bank account " + bankAccountId);
        }

        return bankAccount;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.BankAccount create(CreateBankAccountParams createBankAccountParams, String owner) {
//        String name = createBankAccountParams.getName();
//        if (!this.bankAccountRepository.findByNameAndOwner(name, owner).isEmpty()) {
//            throw new ResourceAlreadyExistException("Bank account with name \"" + name + "\" already exists");
//        }

//        String accountNumber = createBankAccountParams.getAccountNumber();
//        if (this.bankAccountRepository.findByAccountNumber(accountNumber) != null) {
//            throw new ResourceAlreadyExistException("Bank account with number \"" + accountNumber + "\" already exists");
//        }

        BankAccount bankAccount = new BankAccount();
        bankAccount.setOwner(owner);

        // name
        bankAccount.setName(createBankAccountParams.getName());

        // type, balance
        bankAccount.setAccountType(createBankAccountParams.getAccountType());
        bankAccount.setNetBalance(createBankAccountParams.getNetBalance());

        // number, description
        if (StringUtils.isNotBlank(createBankAccountParams.getDescription())) {
            bankAccount.setDescription(createBankAccountParams.getDescription());
        }
        bankAccount.setAccountNumber(createBankAccountParams.getAccountNumber());
        bankAccount = this.bankAccountRepository.save(bankAccount);
        return bankAccount.toPresentationModel();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.BankAccount partialUpdate(String requester, Long bankAccountId,
                                                                         UpdateBankAccountParams updateBankAccountParams) {
        BankAccount bankAccount = this.bankAccountRepository.findById(bankAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account " + bankAccountId + " not found"));

        // check access
        this.authorizationService.checkAuthorizedToOperateOnContent(bankAccount.getOwner(), requester, ContentType.BANK_ACCOUNT,
                Operation.UPDATE, bankAccountId);

        DaoHelper.updateIfPresent(updateBankAccountParams.hasName(), updateBankAccountParams.getName(),
                bankAccount::setName);

        // description, account number, type
        DaoHelper.updateIfPresent(updateBankAccountParams.hasDescription(), updateBankAccountParams.getDescription(),
                bankAccount::setDescription);
        DaoHelper.updateIfPresent(updateBankAccountParams.hasAccountNumber(), updateBankAccountParams.getAccountNumber(),
                bankAccount::setAccountNumber);
        DaoHelper.updateIfPresent(updateBankAccountParams.hasAccountType(), updateBankAccountParams.getAccountType(),
                bankAccount::setAccountType);

        // net balance ?
        DaoHelper.updateIfPresent(updateBankAccountParams.hasNetBalance(), updateBankAccountParams.getNetBalance(),
                bankAccount::setNetBalance);

        return this.bankAccountRepository.save(bankAccount).toPresentationModel();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteBankAccount(String requester, Long bankAccountId) {
        BankAccount bankAccount = this.bankAccountRepository.findById(bankAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank account " + bankAccountId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(bankAccount.getOwner(), requester, ContentType.BANK_ACCOUNT,
                Operation.DELETE, bankAccountId);

        this.bankAccountRepository.delete(bankAccount);
    }
}
