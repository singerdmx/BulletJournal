package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateTransactionParams;
import com.bulletjournal.controller.models.UpdateTransactionParams;
import com.bulletjournal.controller.utils.IntervalHelper;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.ledger.TransactionType;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Transaction;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.utils.DaoHelper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class TransactionDaoJpa {

    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private AuthorizationService authorizationService;

    /**
     * Get transactions list from project
     * <p>
     * Parameter:
     *
     * @projectId Long - Project identifier to retrieve project from project repository
     * @retVal List<Transaction> - List of transaction
     */
    public List<com.bulletjournal.controller.models.Transaction> getTransactions(Long projectId) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        return this.transactionRepository.findAllByProject(project)
                .stream()
                .sorted((a, b) -> b.getStartTime().compareTo(a.getStartTime()))
                .map(Transaction::toPresentationModel)
                .collect(Collectors.toList());
    }

    /**
     * Get transaction from Ledger Repository
     * <p>
     * Parameter:
     *
     * @id Long - Transaction identifier to retrieve transaction from ledger repository
     * @retVal Transaction - Transaction object
     */
    public Transaction getTransaction(Long id) {
        return this.transactionRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction " + id + " not found"));
    }

    /**
     * Get transactions based on owner and interval from Ledger Repository
     * <p>
     * Parameter:
     *
     * @projectId Long - Transaction identifier to retrieve transaction from ledger repository
     * @startTime ZoneDateTime - Start Time to retrieve transaction from ledger repository
     * @endTime ZoneDateTime - End Time to retrieve transaction from ledger repository
     * @retVal Transaction - Transaction object
     */
    public List<com.bulletjournal.controller.models.Transaction> findTransactionsByInterval(String payer, ZonedDateTime startTime, ZonedDateTime endTime) {
        return this.transactionRepository.findTransactionsByPayerInterval(payer,
                Timestamp.from(startTime.toInstant()), Timestamp.from(endTime.toInstant()))
                .stream().map(Transaction::toPresentationModel).collect(Collectors.toList());
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Transaction create(Long projectId, String owner, CreateTransactionParams createTransaction) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

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
        transaction.setStartTime(Timestamp.from(IntervalHelper.getStartTime(createTransaction.getDate(),
                createTransaction.getTime(),
                createTransaction.getTimezone())
                .toInstant()));
        transaction.setEndTime(Timestamp.from(IntervalHelper.getEndTime(createTransaction.getDate(),
                createTransaction.getTime(),
                createTransaction.getTimezone())
                .toInstant()));
        return this.transactionRepository.save(transaction);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Event> partialUpdate(String requester, Long transactionId, UpdateTransactionParams updateTransactionParams) {
        Transaction transaction = this.transactionRepository
                .findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction " + transactionId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                transaction.getOwner(), requester, ContentType.TRANSACTION, Operation.UPDATE,
                transactionId, transaction.getProject().getOwner());

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasName(), updateTransactionParams.getName(), transaction::setName);

        List<Event> events = this.updatePayer(requester, transactionId, updateTransactionParams, transaction);

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasTransactionType(), TransactionType.getType(
                        updateTransactionParams.getTransactionType()), transaction::setTransactionType);

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasAmount(), updateTransactionParams.getAmount(), transaction::setAmount);

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasDate(), updateTransactionParams.getDate(), transaction::setDate);

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasTime(), updateTransactionParams.getTime(), transaction::setTime);

        DaoHelper.updateIfPresent(updateTransactionParams.hasDate() || updateTransactionParams.hasTime(),
                Timestamp.from(IntervalHelper.getStartTime(transaction.getDate(), transaction.getTime(),
                        transaction.getTimezone()).toInstant()), transaction::setStartTime);

        DaoHelper.updateIfPresent(updateTransactionParams.hasDate() || updateTransactionParams.hasTime(),
                Timestamp.from(IntervalHelper.getEndTime(transaction.getDate(), transaction.getTime(),
                        transaction.getTimezone()).toInstant()), transaction::setEndTime);

        this.transactionRepository.save(transaction);

        return events;
    }

    private List<Event> updatePayer(String requester, Long transactionId, UpdateTransactionParams updateTransactionParams, Transaction transaction) {
        String oldPayer = transaction.getPayer();
        String newPayer = updateTransactionParams.getPayer();
        List<Event> events  = new ArrayList<>();

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
    public List<Event> delete(String requester, Long transactionId) {
        Transaction transaction = this.transactionRepository.findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction " + transactionId + " not found"));
        Project project = transaction.getProject();
        Long projectId = project.getId();

        this.authorizationService.checkAuthorizedToOperateOnContent(transaction.getOwner(), requester,
                ContentType.TRANSACTION, Operation.DELETE, projectId, project.getOwner());

        this.transactionRepository.delete(transaction);
        return generateEvents(transaction, requester, project);
    }

    private List<Event> generateEvents(Transaction transaction, String requester, Project project) {
        List<Event> events = new ArrayList<>();
        for (UserGroup userGroup : project.getGroup().getUsers()) {
            if (!userGroup.isAccepted())
                continue;

            String username = userGroup.getUser().getName();
            if (userGroup.getUser().getName().equals(requester))
                continue;

            events.add(new Event(username, transaction.getId(), transaction.getName()));
        }
        return events;
    }


}