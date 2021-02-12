package com.bulletjournal.redis;

import com.bulletjournal.redis.models.BankAccountBalance;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BankAccountBalanceRepository extends CrudRepository<BankAccountBalance, Long> {
}
