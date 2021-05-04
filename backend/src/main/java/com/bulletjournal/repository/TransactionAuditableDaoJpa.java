package com.bulletjournal.repository;

import com.bulletjournal.notifications.ProjectItemAuditable;
import com.bulletjournal.repository.models.Transaction;
import com.bulletjournal.repository.models.TransactionAuditable;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Repository
public class TransactionAuditableDaoJpa {
  @Autowired private TransactionAuditableRepository transactionAuditableRepository;

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public void create(List<ProjectItemAuditable> projectItemAuditables) {
    this.transactionAuditableRepository.saveAll(
        projectItemAuditables.stream()
            .map(ProjectItemAuditable::toRepositoryTransactionAuditable)
            .collect(Collectors.toList()));
  }

  @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
  public Page<TransactionAuditable> getHistory(Transaction transaction, int pageInd, int pageSize) {
    return this.transactionAuditableRepository.findAllByTransaction(
        transaction, PageRequest.of(pageInd, pageSize, Sort.by("activityTime").descending()));
  }
}
