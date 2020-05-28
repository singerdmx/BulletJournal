package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateTransactionParams;
import com.bulletjournal.controller.models.Label;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.UpdateTransactionParams;
import com.bulletjournal.controller.utils.ProjectItemsGrouper;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.ledger.TransactionType;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.*;
import com.bulletjournal.repository.utils.DaoHelper;
import org.apache.commons.lang3.tuple.Pair;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class TransactionDaoJpa extends ProjectItemDaoJpa<TransactionContent> {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private ProjectDaoJpa projectDaoJpa;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private TransactionContentRepository transactionContentRepository;

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
    public List<com.bulletjournal.controller.models.Transaction> getTransactions(Long projectId,
            ZonedDateTime startTime, ZonedDateTime endTime, String requester) {
        Project project = this.projectDaoJpa.getProject(projectId, requester);

        return this.transactionRepository
                .findTransactionsByProjectBetween(project, Timestamp.from(startTime.toInstant()),
                        Timestamp.from(endTime.toInstant()))
                .stream().sorted((a, b) -> b.getStartTime().compareTo(a.getStartTime()))
                .map(transaction -> addLabels(transaction)).collect(Collectors.toList());
    }

    /**
     * Get transaction from Ledger Repository
     * <p>
     * Parameter:
     *
     * @param id - Transaction identifier to retrieve transaction from ledger
     *           repository
     * @retVal a Transaction object
     */
    public com.bulletjournal.controller.models.Transaction getTransaction(String requester, Long id) {
        Transaction transaction = this.getProjectItem(id, requester);
        return addLabels(transaction);
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
     * @retVal List of Transaction
     */
    public List<Transaction> getTransactionsBetween(String payer, ZonedDateTime startTime, ZonedDateTime endTime) {
        return this.transactionRepository.findTransactionsOfPayerBetween(payer, Timestamp.from(startTime.toInstant()),
                Timestamp.from(endTime.toInstant()));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Pair<Transaction, Project> create(Long projectId, String owner, CreateTransactionParams createTransaction) {
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
        transaction.setTime(createTransaction.getTime());
        transaction.setTimezone(createTransaction.getTimezone());
        transaction.setTransactionType(TransactionType.getType(createTransaction.getTransactionType()));
        if (createTransaction.getLabels() != null && !createTransaction.getLabels().isEmpty()) {
            transaction.setLabels(createTransaction.getLabels());
        }

        String date = createTransaction.getDate();
        String time = createTransaction.getTime();
        String timezone = createTransaction.getTimezone();
        transaction.setStartTime(Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()));
        transaction.setEndTime(Timestamp.from(ZonedDateTimeHelper.getEndTime(date, time, timezone).toInstant()));

        return Pair.of(this.transactionRepository.save(transaction), project);
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
        transactions.sort(ProjectItemsGrouper.TRANSACTION_COMPARATOR);
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

        String date = updateTransactionParams.getOrDefaultDate(transaction.getDate());
        String time = updateTransactionParams.getOrDefaultTime(transaction.getTime());
        String timezone = updateTransactionParams.getOrDefaultTimezone(transaction.getTimezone());

        DaoHelper.updateIfPresent(updateTransactionParams.needsUpdateDateTime(),
                Timestamp.from(ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant()),
                transaction::setStartTime);

        DaoHelper.updateIfPresent(updateTransactionParams.needsUpdateDateTime(),
                Timestamp.from(ZonedDateTimeHelper.getEndTime(date, time, timezone).toInstant()),
                transaction::setEndTime);

        this.transactionRepository.save(transaction);
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
    public Pair<List<Event>, Transaction> delete(String requester, Long transactionId) {
        Transaction transaction = this.getProjectItem(transactionId, requester);
        Project project = transaction.getProject();
        Long projectId = project.getId();

        this.authorizationService.checkAuthorizedToOperateOnContent(transaction.getOwner(), requester,
                ContentType.TRANSACTION, Operation.DELETE, projectId, project.getOwner());

        this.transactionRepository.delete(transaction);
        return Pair.of(generateEvents(transaction, requester, project), transaction);
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
    public void move(String requester, Long projectItemId, Long targetProject) {
        Project project = this.projectDaoJpa.getProject(targetProject, requester);

        Transaction projectItem = this.getProjectItem(projectItemId, requester);
        if (!Objects.equals(projectItem.getProject().getType(), project.getType())) {
            throw new BadRequestException("Cannot move to Project Type " + project.getType());
        }
        this.authorizationService.checkAuthorizedToOperateOnContent(projectItem.getOwner(), requester,
                ContentType.TRANSACTION, Operation.UPDATE, targetProject, project.getOwner());
        projectItem.setProject(project);
        this.getJpaRepository().save(projectItem);
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
    List<Long> findItemLabelsByProject(Project project) {
        return transactionRepository.findUniqueLabelsByProject(project.getId());
    }

    @Override
    List<ProjectItemModel> findRecentProjectItemsBetween(Timestamp startTime, Timestamp endTime) {
        List<ProjectItemModel> result = new ArrayList<>();
        result.addAll(this.transactionRepository.findRecentTransactionsBetween(startTime, endTime));
        return result;
    }

    @Override
    List<TransactionContent> findRecentProjectItemContentsBetween(Timestamp startTime, Timestamp endTime) {
        return this.transactionContentRepository.findRecentTransactionContentsBetween(startTime, endTime);
    }
}
