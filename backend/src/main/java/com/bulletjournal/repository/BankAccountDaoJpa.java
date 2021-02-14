package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.params.CreateBankAccountParams;
import com.bulletjournal.controller.models.params.UpdateBankAccountParams;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.redis.BankAccountBalanceRepository;
import com.bulletjournal.redis.models.BankAccountBalance;
import com.bulletjournal.repository.models.BankAccount;
import com.bulletjournal.repository.models.BankAccountTransaction;
import com.bulletjournal.repository.models.Transaction;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
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
    private TransactionRepository transactionRepository;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private BankAccountTransactionRepository bankAccountTransactionRepository;
    @Autowired
    private BankAccountBalanceRepository bankAccountBalanceRepository;
    @Lazy
    @Autowired
    private TransactionDaoJpa transactionDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.BankAccount> getBankAccounts(String requester) {
        List<BankAccount> bankAccounts = this.bankAccountRepository.findAllByOwner(requester);
        return bankAccounts.stream()
                .sorted((a, b) -> b.getUpdatedAt().compareTo(a.getUpdatedAt()))
                .map(b -> b.toPresentationModel(this))
                .collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BankAccount getBankAccount(String requester, Long bankAccountId) {
        if (bankAccountId == null) {
            return null;
        }
        BankAccount bankAccount = this.bankAccountRepository.findById(bankAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank Account " + bankAccountId + " not found"));
        // check access
        this.authorizationService.checkAuthorizedToOperateOnContent(
                bankAccount.getOwner(), requester, ContentType.BANK_ACCOUNT,
                Operation.READ, bankAccountId);

        return bankAccount;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.BankAccount create(CreateBankAccountParams createBankAccountParams, String owner) {
        BankAccount bankAccount = new BankAccount();
        bankAccount.setOwner(owner);
        bankAccount.setName(createBankAccountParams.getName());
        bankAccount.setAccountType(createBankAccountParams.getAccountType());
        bankAccount.setDescription(createBankAccountParams.getDescription());
        bankAccount.setAccountNumber(createBankAccountParams.getAccountNumber());

        // net balance is 0 when create ?
        bankAccount.setNetBalance(0.0);

        bankAccount = this.bankAccountRepository.save(bankAccount);
        this.bankAccountBalanceRepository.save(new BankAccountBalance(bankAccount.getId(), 0));
        return bankAccount.toPresentationModel();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.BankAccount update(String requester, Long bankAccountId,
                                                                  UpdateBankAccountParams updateBankAccountParams) {
        BankAccount bankAccount = getBankAccount(requester, bankAccountId);

        if (!updateBankAccountParams.hasName()) {
            throw new BadRequestException("Name cannot be empty");
        }
        if (!updateBankAccountParams.hasAccountType()) {
            throw new BadRequestException("Account type cannot be empty");
        }

        // check access
        this.authorizationService.checkAuthorizedToOperateOnContent(
                bankAccount.getOwner(), requester, ContentType.BANK_ACCOUNT,
                Operation.UPDATE, bankAccountId);

        bankAccount.setAccountNumber(updateBankAccountParams.getAccountNumber());
        bankAccount.setName(updateBankAccountParams.getName());
        bankAccount.setDescription(updateBankAccountParams.getDescription());
        bankAccount.setAccountType(updateBankAccountParams.getAccountType());

        return this.bankAccountRepository.save(bankAccount).toPresentationModel(this);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteBankAccount(String requester, Long bankAccountId) {
        BankAccount bankAccount = getBankAccount(requester, bankAccountId);
        List<Transaction> transactions = this.transactionRepository.findByBankAccount(bankAccount);
        for (Transaction t: transactions) {
            t.setBankAccount(null);
        }
        this.authorizationService.checkAuthorizedToOperateOnContent(bankAccount.getOwner(), requester, ContentType.BANK_ACCOUNT,
                Operation.DELETE, bankAccountId);

        this.bankAccountRepository.delete(bankAccount);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public double getBankAccountBalance(Long bankAccountId) {
        if (this.bankAccountBalanceRepository.existsById(bankAccountId)) {
            return this.bankAccountBalanceRepository.findById(bankAccountId).get().getBalance();
        }
        BankAccount bankAccount = this.bankAccountRepository.findById(bankAccountId)
                .orElseThrow(() -> new ResourceNotFoundException("Bank Account " + bankAccountId + " not found"));
        double sum = bankAccount.getNetBalance() +
                this.transactionRepository.getTransactionsAmountSumByBankAccount(bankAccountId) +
                this.transactionDaoJpa.getRecurringTransactionsAmountSum(bankAccount);
        this.bankAccountBalanceRepository.save(new BankAccountBalance(bankAccountId, sum));
        return sum;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void setBalance(String requester, Long bankAccountId, double balance, String name) {
        BankAccount bankAccount = getBankAccount(requester, bankAccountId);
        double oldBalance = getBankAccountBalance(bankAccountId);
        double change = balance - oldBalance;
        if (Math.abs(change) < 0.000001) {
            return;
        }
        BankAccountTransaction bankAccountTransaction = new BankAccountTransaction();
        bankAccountTransaction.setBankAccount(bankAccount);
        bankAccountTransaction.setName(name);
        bankAccountTransaction.setAmount(change);
        bankAccount.setNetBalance(bankAccount.getNetBalance() + change);
        this.bankAccountTransactionRepository.save(bankAccountTransaction);

        this.bankAccountBalanceRepository.save(new BankAccountBalance(bankAccountId, balance));
    }
}
