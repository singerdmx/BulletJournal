package com.bulletjournal.repository;

import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
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

import java.sql.Timestamp;
import java.time.ZonedDateTime;
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
  public Page<TransactionAuditable> getHistory(
      Transaction transaction, int pageInd, int pageSize, String startDate, String endDate, String timezone) {

    if (startDate != null && endDate != null && timezone != null) {
      ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(startDate, null, timezone);
      ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(endDate, null, timezone);
      return this.transactionAuditableRepository.findAllByTransactionAndActivityTimeBetween(
          transaction,
          Timestamp.from(startTime.toInstant()),
          Timestamp.from(endTime.toInstant()),
          PageRequest.of(pageInd, pageSize, Sort.by("activityTime").descending()));
    }

    return this.transactionAuditableRepository.findAllByTransaction(
        transaction, PageRequest.of(pageInd, pageSize, Sort.by("activityTime").descending()));
  }
}
