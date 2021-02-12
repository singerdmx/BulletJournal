package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateBankAccountParams;
import com.bulletjournal.controller.models.UpdateBankAccountParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.redis.BankAccountBalanceRepository;
import com.bulletjournal.redis.models.BankAccountBalance;
import com.bulletjournal.repository.models.AuditModel;
import com.bulletjournal.repository.models.BankAccount;
import com.bulletjournal.repository.models.BankAccountTransaction;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Comparator;
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.BankAccount> getBankAccounts(String requester) {
        List<BankAccount> bankAccounts = this.bankAccountRepository.findAllByOwner(requester);
        return bankAccounts.stream()
                .sorted(Comparator.comparing(AuditModel::getUpdatedAt))
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
        bankAccount = this.bankAccountRepository.save(bankAccount);
        this.bankAccountBalanceRepository.save(new BankAccountBalance(bankAccount.getId(), 0));
        return bankAccount.toPresentationModel();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public com.bulletjournal.controller.models.BankAccount partialUpdate(String requester, Long bankAccountId,
                                                                         UpdateBankAccountParams updateBankAccountParams) {
        BankAccount bankAccount = getBankAccount(requester, bankAccountId);

        // check access
        this.authorizationService.checkAuthorizedToOperateOnContent(
                bankAccount.getOwner(), requester, ContentType.BANK_ACCOUNT,
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

        return this.bankAccountRepository.save(bankAccount).toPresentationModel(this);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteBankAccount(String requester, Long bankAccountId) {
        BankAccount bankAccount = getBankAccount(requester, bankAccountId);
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
        // add recurring amount
        double sum = bankAccount.getNetBalance() +
                this.transactionRepository.getTransactionsAmountSumByBankAccount(bankAccountId);
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
