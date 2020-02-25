package com.bulletjournal.repository;

import com.bulletjournal.authz.AuthorizationService;
import com.bulletjournal.authz.Operation;
import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.models.CreateTransactionParams;
import com.bulletjournal.controller.models.UpdateTransactionParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.ledger.TransactionType;
import com.bulletjournal.notifications.Event;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Transaction;
import com.bulletjournal.repository.models.UserGroup;
import com.bulletjournal.repository.utils.DaoHelper;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Repository
public class TransactionDaoJpa {

    private static final Gson GSON = new Gson();
    @Autowired
    private TransactionRepository transactionRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private AuthorizationService authorizationService;
    @Autowired
    private ProjectLedgersRepository projectLedgersRepository;

    /**
     * Get transactions list from project
     * <p>
     * Parameter:
     *
     * @projectId Long - Project identifier to retrieve project from project repository
     * @retVal List<Transaction> - List of transaction
     */
    public List<Transaction> getTransactions(Long projectId) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        return this.transactionRepository.findTransactionsByProject(project);
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Transaction create(Long projectId, String owner, CreateTransactionParams createTransactionParams) {
        Project project = this.projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ResourceNotFoundException("Project " + projectId + " not found"));

        Transaction transaction = new Transaction();
        transaction.setProject(project);
        transaction.setOwner(owner);
        transaction.setName(createTransactionParams.getName());
        transaction.setPayer(createTransactionParams.getPayer());
        transaction.setAmount(createTransactionParams.getAmount());
        transaction.setDate(createTransactionParams.getDate());
        transaction.setTransactionType(TransactionType.getType(createTransactionParams.getTransactionType()));
        return this.transactionRepository.save(transaction);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Transaction partialUpdate(String requester, Long transactionId, UpdateTransactionParams updateTransactionParams) {
        Transaction transaction = this.transactionRepository
                .findById(transactionId)
                .orElseThrow(() -> new ResourceNotFoundException("Transaction " + transactionId + " not found"));

        this.authorizationService.checkAuthorizedToOperateOnContent(
                transaction.getOwner(), requester, ContentType.TRANSACTION, Operation.UPDATE,
                transactionId, transaction.getProject().getOwner());

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasName(), updateTransactionParams.getName(), transaction::setName);

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasPayer(), updateTransactionParams.getPayer(), transaction::setPayer);

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasTransactionType(), TransactionType.getType(updateTransactionParams.getTransactionType()), transaction::setTransactionType);

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasAmount(), updateTransactionParams.getAmount(), transaction::setAmount);

        DaoHelper.updateIfPresent(
                updateTransactionParams.hasDate(), updateTransactionParams.getDate(), transaction::setDate);

        return this.transactionRepository.save(transaction);
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