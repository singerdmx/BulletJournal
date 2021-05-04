package com.bulletjournal.repository;

import com.bulletjournal.repository.models.Transaction;
import com.bulletjournal.repository.models.TransactionAuditable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TransactionAuditableRepository
    extends PagingAndSortingRepository<TransactionAuditable, Long> {
  Page<TransactionAuditable> findAllByTransaction(Transaction transaction, Pageable pageable);
}
