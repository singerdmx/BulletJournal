package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.params.CreateTransactionParams;
import com.bulletjournal.controller.models.params.UpdateTransactionParams;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.es.ESUtil;
import com.bulletjournal.es.repository.SearchIndexDaoJpa;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.ledger.TransactionType;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.redis.BankAccountBalanceRepository;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import com.bulletjournal.util.BuJoRecurrenceRule;
import com.google.common.collect.ImmutableList;
import org.apache.commons.lang3.StringUtils;
import org.apache.commons.lang3.tuple.Pair;
import org.dmfs.rfc5545.DateTime;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.*;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Repository
public class TransactionDaoJpa extends ProjectItemDaoJpa<TransactionContent> {

    private static final Logger LOGGER = LoggerFactory.getLogger(TransactionDaoJpa.class);
    @PersistenceContext
    EntityManager entityManager;
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private ProjectDaoJpa projectDaoJpa;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private TransactionContentRepository transactionContentRepository;
    @Autowired
    private SearchIndexDaoJpa searchIndexDaoJpa;
    @Autowired
    private BankAccountDaoJpa bankAccountDaoJpa;
    @Autowired
    private BankAccountTransactionRepository bankAccountTransactionRepository;
    @Autowired
    private BankAccountBalanceRepository bankAccountBalanceRepository;
    @Autowired
    private UserDaoJpa userDaoJpa;
    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Override
    public JpaRepository getJpaRepository() {
        return transactionRepository;
    }

    /**
     * Retrieve transactions list from project within the range
     * <p>
     * Parameter:
     *
     * @param projectId - Project identifier to retrieve project from project
     *                  repository
     * @param startTime - Range start time
     * @param endTime   - Range end time
     * @retVal List<Transaction> - List of transaction
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Transaction> getTransactions(
            Long projectId,
            ZonedDateTime startTime,
            ZonedDateTime endTime,
            String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);

        List<Transaction> transactions = this.transactionRepository
                .findTransactionsByProjectBetween(project, Timestamp.from(startTime.toInstant()),
                        Timestamp.from(endTime.toInstant()));
        transactions.addAll(
                this.getRecurringTransactions(startTime, endTime, ImmutableList.of(project), Optional.empty()));
        return transactions
                .stream().sorted((a, b) -> {
                    if (Objects.equals(a.getStartTime(), b.getStartTime())) {
                        return Long.compare(a.getId(), b.getId());
                    }

                    return a.getStartTime().compareTo(b.getStartTime());
                }).map(transaction -> addLabels(transaction)).collect(Collectors.toList());
    }

    /**
     * Get transaction from Ledger Repository
     * <p>
     * Parameter:
     *
     * @param id - Transaction identifier to retrieve transaction from ledger
     *           repository
     * @return a Transaction object
     */
    public com.bulletjournal.controller.models.Transaction getTransaction(String requester, Long id) {
        Transaction transaction = this.getProjectItem(id, requester);
        com.bulletjournal.controller.models.Transaction result = addLabels(transaction);
        if (Objects.equals(requester, transaction.getPayer()) && transaction.getBankAccount() != null) {
            result.setBankAccount(transaction.getBankAccount().toPresentationModel(bankAccountDaoJpa));
        }
        return result;
    }

    private com.bulletjournal.controller.models.Transaction addLabels(Transaction transaction) {
        List<Label> labels = this.getLabelsToProjectItem(transaction);
        return transaction.toPresentationModel(labels);
    }

    /**
     * Get transactions based on owner and interval from Ledger Repository
     * <p>
     * Parameter:
     *
     * @param payer     - Payer identifier to retrieve transaction from ledger
     *                  repository
     * @param startTime - Start Time to retrieve transaction from ledger repository
     * @param endTime   - End Time to retrieve transaction from ledger repository
     * @return List of Transaction
     */
    public List<Transaction> getTransactionsBetween(
            String payer, ZonedDateTime startTime, ZonedDateTime endTime, List<Project> projects) {
        List<Transaction> result = this.transactionRepository.findTransactionsOfPayerBetween(payer, Timestamp.from(startTime.toInstant()),
                Timestamp.from(endTime.toInstant()), projects);
        result.addAll(this.getRecurringTransactions(startTime, endTime, projects, Optional.of(payer)));
        return result;
    }

    private List<Transaction> getRecurringTransactions(
            List<Transaction> targetTransactions, ZonedDateTime startTime, ZonedDateTime endTime) {
        List<Transaction> recurringTransactionsBetween = new ArrayList<>();

        for (Transaction transaction : targetTransactions) {
            List<Transaction> recurringTransactions = DaoHelper.getRecurringTransaction(transaction, startTime, endTime);
            recurringTransactionsBetween.addAll(recurringTransactions);
        }

        return recurringTransactionsBetween;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Transaction create(Long projectId, String owner, CreateTransactionParams createTransaction) {
        Project project = this.projectDaoJpa.getProject(projectId, owner);
        if (!ProjectType.LEDGER.equals(ProjectType.getType(project.getType()))) {
            throw new BadRequestException("Project Type expected to be LEDGER while request is " + project.getType());
        }

        Transaction transaction = new Transaction();
        transaction.setProject(project);
        transaction.setOwner(owner);
        transaction.setName(createTransaction.getName());
        transaction.setPayer(createTransaction.getPayer());
        transaction.setAmount(createTransaction.getAmount());
        transaction.setDate(createTransaction.getDate());
        transaction.setRecurrenceRule(createTransaction.getRecurrenceRule());

        transaction.setTime(createTransaction.getTime());
        transaction.setTimezone(createTransaction.getTimezone());
        transaction.setLocation(createTransaction.getLocation());
        transaction.setTransactionType(TransactionType.getType(createTransaction.getTransactionType()));
        if (createTransaction.getLabels() != null && !createTransaction.getLabels().isEmpty()) {
            transaction.setLabels(createTransaction.getLabels());
        }

        if (createTransaction.hasRecurrenceRule()) {
            transaction.setDate(null);
            transaction.setTime(null);
        } else {
            String date = createTransaction.getDate();
            String time = createTransaction.getTime();
            String timezone = createTransaction.getTimezone();
            transaction.setStartTime(Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()));
            transaction.setEndTime(Timestamp.from(ZonedDateTimeHelper.getEndTime(date, time, timezone).toInstant()));
        }

        transaction = this.transactionRepository.save(transaction);
        if (createTransaction.hasBankAccountId() && Objects.equals(owner, transaction.getPayer())) {
            this.setBankAccount(owner, transaction.getId(), createTransaction.getBankAccountId());
        }
        return transaction;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Transaction> getTransactionsByPayer(Long projectId,
                                                                                        String requester, String payer, ZonedDateTime startTime, ZonedDateTime endTime) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        if (project.isShared()) {
            return Collections.emptyList();
        }

        List<Transaction> transactions = this.transactionRepository.findTransactionsInProjectByPayerBetween(payer,
                project, Timestamp.from(startTime.toInstant()), Timestamp.from(endTime.toInstant()));
        transactions.addAll(this.getRecurringTransactions(
                startTime, endTime, ImmutableList.of(project), Optional.of(payer)));
        transactions.sort(ProjectItemsGrouper.TRANSACTION_COMPARATOR);
        return transactions.stream().map(t -> {
            List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(t);
            return t.toPresentationModel(labels);
        }).collect(Collectors.toList());
    }

    /**
     * Get all recurrent transactions paid by payer (optional) in [startTime, endTime]
     *
     * @param payer     the payer of recurrent transaction
     * @param startTime the requested range start time
     * @param endTime   the requested range end time
     * @return List<Transaction> - a list of recurrent transactions within the time range
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Transaction> getRecurringTransactions(
            ZonedDateTime startTime, ZonedDateTime endTime, List<Project> projects, Optional<String> payer) {
        List<Transaction> recurringTransactions;
        if (payer.isPresent()) {
            recurringTransactions = this.transactionRepository
                    .findRecurringTransactionsOfPayer(payer.get(), projects);
        } else {
            recurringTransactions = this.transactionRepository.findRecurringTransactions(projects);
        }
        return getRecurringTransactions(recurringTransactions, startTime, endTime);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Transaction> getRecurringTransactions(
            String requester, Long projectId) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);
        List<Transaction> transactions = this.transactionRepository.findRecurringTransactionsByProject(project);
        return transactions.stream().map(t -> {
            List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(t);
            return t.toPresentationModel(labels);
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<List<Event>, Transaction> partialUpdate(String requester, Long transactionId,
                                                        UpdateTransactionParams updateTransactionParams) {
        Transaction transaction = this.getProjectItem(transactionId, requester);

        this.authorizationService.checkAuthorizedToOperateOnContent(transaction.getOwner(), requester,
                ContentType.TRANSACTION, Operation.UPDATE, transactionId, transaction.getProject().getOwner());

        DaoHelper.updateIfPresent(updateTransactionParams.hasName(), updateTransactionParams.getName(),
                transaction::setName);

        List<Event> events = this.updatePayer(requester, transactionId, updateTransactionParams, transaction);

        DaoHelper.updateIfPresent(updateTransactionParams.hasTransactionType(),
                updateTransactionParams.hasTransactionType()
                        ? TransactionType.getType(updateTransactionParams.getTransactionType())
                        : null,
                transaction::setTransactionType);

        DaoHelper.updateIfPresent(updateTransactionParams.hasAmount(), updateTransactionParams.getAmount(),
                transaction::setAmount);

        DaoHelper.updateIfPresent(updateTransactionParams.hasDate(), updateTransactionParams.getDate(),
                transaction::setDate);

        DaoHelper.updateIfPresent(updateTransactionParams.hasTime(), updateTransactionParams.getTime(),
                transaction::setTime);

        DaoHelper.updateIfPresent(updateTransactionParams.hasTimezone(), updateTransactionParams.getTimezone(),
                transaction::setTimezone);

        DaoHelper.updateIfPresent(updateTransactionParams.hasLocation(), updateTransactionParams.getLocation(),
                transaction::setLocation);

        String date = updateTransactionParams.getOrDefaultDate(transaction.getDate());
        String time = updateTransactionParams.getOrDefaultTime(transaction.getTime());
        String timezone = updateTransactionParams.getOrDefaultTimezone(transaction.getTimezone());

        if (date != null) {
            DaoHelper.updateIfPresent(updateTransactionParams.needsUpdateDateTime(),
                    Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()),
                    transaction::setStartTime);
            DaoHelper.updateIfPresent(updateTransactionParams.needsUpdateDateTime(),
                    Timestamp.from(ZonedDateTimeHelper.getEndTime(date, time, timezone).toInstant()),
                    transaction::setEndTime);
        }

        transaction.setRecurrenceRule(updateTransactionParams.getRecurrenceRule());
        if (updateTransactionParams.hasRecurrenceRule()) {
            transaction.setDate(null);
            transaction.setTime(null);
            transaction.setStartTime(null);
            transaction.setEndTime(null);
        }

        if (updateTransactionParams.hasLabels()) {
            transaction.setLabels(updateTransactionParams.getLabels());
        }

        transaction = this.transactionRepository.save(transaction);

        if (transaction.hasBankAccount()) {
            this.bankAccountBalanceRepository.deleteById(transaction.getBankAccount().getId());
        }
        if (updateTransactionParams.hasBankAccountId() && Objects.equals(requester, transaction.getPayer())) {
            transaction = this.setBankAccount(requester, transactionId, updateTransactionParams.getBankAccountId());
        }
        if (transaction.hasBankAccount() && !Objects.equals(
                transaction.getPayer(), transaction.getBankAccount().getOwner())) {
            transaction = this.setBankAccount(transaction.getBankAccount().getOwner(),
                    transactionId, null);
        }
        return Pair.of(events, transaction);
    }

    private List<Event> updatePayer(String requester, Long transactionId,
                                    UpdateTransactionParams updateTransactionParams, Transaction transaction) {
        List<Event> events = new ArrayList<>();

        if (!updateTransactionParams.hasPayer())
            return events;

        String oldPayer = transaction.getPayer();
        String newPayer = updateTransactionParams.getPayer();

        if (!Objects.equals(oldPayer, newPayer)) {
            LOGGER.info("Reset Bank Account for Payer Change");
            transaction.setBankAccount(null);
            transaction.setPayer(newPayer);
            if (!Objects.equals(requester, newPayer)) {
                events.add(new Event(newPayer, transactionId, transaction.getName()));
            }
            if (!Objects.equals(requester, oldPayer)) {
                events.add(new Event(oldPayer, transactionId, transaction.getName()));
            }
        }
        return events;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<List<Event>, Transaction> delete(String requester, Long transactionId, String dateTime) {
        Transaction transaction = this.getProjectItem(transactionId, requester);
        Project project = transaction.getProject();
        Long projectId = project.getId();

        this.authorizationService.checkAuthorizedToOperateOnContent(transaction.getOwner(), requester,
                ContentType.TRANSACTION, Operation.DELETE, projectId, project.getOwner());

        if (transaction.hasBankAccount()) {
            this.bankAccountBalanceRepository.deleteById(transaction.getBankAccount().getId());
        }
        if (dateTime != null && StringUtils.isNotBlank(transaction.getRecurrenceRule())) {
            return deleteSingleRecurringTransaction(transaction, dateTime);
        }

        this.transactionRepository.delete(transaction);
        return Pair.of(generateEvents(transaction, requester, project), transaction);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<List<Event>, Transaction> deleteSingleRecurringTransaction(Transaction transaction, String dateTimeStr) {
        Set<String> deletedSlotsSet = ZonedDateTimeHelper.parseDateTimeSet(transaction.getDeletedSlots());
        String timezone = transaction.getTimezone();
        DateTime dateTime = ZonedDateTimeHelper.getDateTime(ZonedDateTimeHelper.convertDateTime(dateTimeStr, timezone));

        if (deletedSlotsSet.contains(dateTime.toString())) {
            throw new IllegalArgumentException("Duplicated transaction deleted");
        }

        // update deleted slots and save
        transaction.setDeletedSlots(transaction.getDeletedSlots() == null ? dateTime.toString()
                : transaction.getDeletedSlots() + "," + dateTime.toString());
        this.transactionRepository.save(transaction);
        return Pair.of(Collections.emptyList(), transaction);
    }

    private List<Event> generateEvents(Transaction transaction, String requester, Project project) {
        List<Event> events = new ArrayList<>();
        for (UserGroup userGroup : project.getGroup().getAcceptedUsers()) {
            String username = userGroup.getUser().getName();
            if (userGroup.getUser().getName().equals(requester))
                continue;

            events.add(new Event(username, transaction.getId(), transaction.getName()));
        }
        return events;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<Transaction, Project> move(String requester, Long projectItemId, Long targetProject) {
        Project project = this.projectDaoJpa.getProject(targetProject, requester);

        Transaction projectItem = this.getProjectItem(projectItemId, requester);
        if (!Objects.equals(projectItem.getProject().getType(), project.getType())) {
            throw new BadRequestException("Cannot move to Project Type " + project.getType());
        }
        this.authorizationService.checkAuthorizedToOperateOnContent(projectItem.getOwner(), requester,
                ContentType.TRANSACTION, Operation.UPDATE, targetProject, project.getOwner());
        projectItem.setProject(project);
        this.getJpaRepository().save(projectItem);
        return Pair.of(projectItem, project);
    }

    @Override
    public JpaRepository getContentJpaRepository() {
        return this.transactionContentRepository;
    }

    @Override
    public <T extends ProjectItemModel> List<TransactionContent> findContents(T projectItem) {
        return this.transactionContentRepository.findTransactionContentByTransaction((Transaction) projectItem);
    }

    @Override
    public TransactionContent newContent(String text) {
        return new TransactionContent(text);
    }

    @Override
    List<Long> findItemLabelsByProject(Project project) {
        return transactionRepository.findUniqueLabelsByProject(project.getId());
    }

    @Override
    List<Transaction> findRecentProjectItemsBetween(Timestamp startTime, Timestamp endTime, List projects) {
        return this.transactionRepository.findTransactionsBetween(startTime, endTime, projects);
    }

    @Override
    public List<Object[]> findRecentProjectItemContentsBetween(Timestamp startTime, Timestamp endTime, List projectIds) {
        StringBuilder queryBuilder = new StringBuilder(
                "SELECT transactions_join_transaction_contents.id, transactions_join_transaction_contents.most_recent_time " +
                        "FROM transactions_join_transaction_contents " +
                        "WHERE transactions_join_transaction_contents.most_recent_time >= ? " +
                        "AND transactions_join_transaction_contents.most_recent_time <= ? " +
                        "AND transactions_join_transaction_contents.project_id IN (");
        projectIds.stream().forEach(pi -> queryBuilder.append(pi).append(","));
        int tail = queryBuilder.length() - 1;
        if (queryBuilder.charAt(tail) == ',') {
            queryBuilder.deleteCharAt(tail);
        }
        queryBuilder.append(")");
        return entityManager.createNativeQuery(queryBuilder.toString())
                .setParameter(1, startTime)
                .setParameter(2, endTime)
                .getResultList();
    }

    public List<String> getDeleteESDocumentIdsForProjectItem(String requester, Long transactionId) {
        List<String> deleteESDocumentIds = new ArrayList<>();
        Transaction transaction = this.getProjectItem(transactionId, requester);

        deleteESDocumentIds.add(ESUtil.getProjectItemSearchIndexId(transaction));
        List<TransactionContent> transactionContents = findContents(transaction);
        for (TransactionContent content : transactionContents) {
            deleteESDocumentIds.add(this.searchIndexDaoJpa.getContentSearchIndexId(content));
        }

        return deleteESDocumentIds;
    }

    public List<String> getDeleteESDocumentIdsForContent(String requester, Long contentId) {
        List<String> deleteESDocumentIds = new ArrayList<>();
        TransactionContent content = this.getContent(contentId, requester);
        deleteESDocumentIds.add(this.searchIndexDaoJpa.getContentSearchIndexId(content));

        return deleteESDocumentIds;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void setColor(String requester, Long transactionId, String color) {
        Transaction transaction = this.getProjectItem(transactionId, requester);
        this.authorizationService.checkAuthorizedToOperateOnContent(transaction.getOwner(), requester,
                ContentType.TRANSACTION, Operation.UPDATE, transactionId, transaction.getProject().getOwner());
        transaction.setColor(color);
        this.transactionRepository.save(transaction);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Transaction setBankAccount(
            String requester, Long transactionId, Long bankAccountId) {
        Transaction transaction = this.getProjectItem(transactionId, requester);
        if (!transaction.getPayer().equals(requester)) {
            throw new UnAuthorizedException("Only payer " + transaction.getOwner() + " can set bank account");
        }

        if (transaction.hasBankAccount()) {
            if (Objects.equals(transaction.getBankAccount().getId(), bankAccountId)) {
                return transaction;
            }
            this.bankAccountBalanceRepository.deleteById(transaction.getBankAccount().getId());
        }

        BankAccount bankAccount = this.bankAccountDaoJpa.getBankAccount(requester, bankAccountId);
        transaction.setBankAccount(bankAccount);
        transaction = this.transactionRepository.save(transaction);
        if (bankAccountId != null) {
            this.bankAccountBalanceRepository.deleteById(bankAccountId);
        }
        return transaction;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.Transaction> getBankAccountTransactions(
            Long bankAccountId, ZonedDateTime startTime, ZonedDateTime endTime, String requester) {
        BankAccount bankAccount = this.bankAccountDaoJpa.getBankAccount(requester, bankAccountId);
        Timestamp start = Timestamp.from(startTime.toInstant());
        Timestamp end = Timestamp.from(endTime.toInstant());
        List<com.bulletjournal.repository.models.Transaction> transactions = this.transactionRepository
                .findByBankAccountAndRecurrenceRuleNull(start, end, bankAccount);
        List<com.bulletjournal.repository.models.Transaction> bankAccountTransactions = this.bankAccountTransactionRepository
                .findBankAccountTransactionByBankAccountBetween(start, end, bankAccount).stream()
                .map(BankAccountTransaction::toTransaction).collect(Collectors.toList());

        transactions.addAll(bankAccountTransactions);

        List<com.bulletjournal.repository.models.Transaction> recurringTransactions =
                this.getRecurringTransactionsInBankAccount(startTime, endTime, bankAccount);

        transactions.addAll(recurringTransactions);
        return transactions.stream().sorted(Comparator.comparing(Transaction::getStartTime)).map(t -> {
            List<com.bulletjournal.controller.models.Label> labels = getLabelsToProjectItem(t);
            return t.toPresentationModel(labels);
        }).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Transaction> getRecurringTransactionsInBankAccount(
            ZonedDateTime startTime, ZonedDateTime endTime, BankAccount bankAccount) {
        final ZonedDateTime now = ZonedDateTime.now();
        if (now.compareTo(endTime) < 0) {
            endTime = now;
        }
        List<com.bulletjournal.repository.models.Transaction> tsWithRRule = this.transactionRepository
                .findByBankAccountAndRecurrenceRuleNotNull(bankAccount);
        return DaoHelper.getRecurringTransactions(tsWithRRule, startTime, endTime);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public double getRecurringTransactionsAmountSum(BankAccount bankAccount) {
        AtomicReference<Double> accountSum = new AtomicReference<>(0.0);

        List<com.bulletjournal.repository.models.Transaction> tsWithRRule = this.transactionRepository
            .findByBankAccountAndRecurrenceRuleNotNull(bankAccount);
        final ZonedDateTime endTime = ZonedDateTime.now();
        tsWithRRule.forEach(ts -> {
            try {
                BuJoRecurrenceRule rule = new BuJoRecurrenceRule(ts.getRecurrenceRule(),
                    ts.getTimezone());
                ZonedDateTime startTime = ZonedDateTimeHelper.getZonedDateTime(rule.getStart());
                List<Transaction> rts = DaoHelper.getRecurringTransaction(ts, startTime, endTime);
                if (!rts.isEmpty()) {
                    accountSum.updateAndGet(v -> v + rts.size() * rts.get(0).getNetAmount());
                }
            } catch (Exception e) {
                LOGGER.error("Error converting transaction's recurrence rule: {}", e.toString());
            }
        });
        return accountSum.get();
    }
}
