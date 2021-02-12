package com.bulletjournal.redis.models;

import com.fasterxml.jackson.annotation.JsonInclude;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;

@RedisHash(value = "BankAccountBalance", timeToLive = 1_800)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class BankAccountBalance {

    @Id
    private Long id;

    private double balance;

    public BankAccountBalance() {
    }

    public BankAccountBalance(Long id, double balance) {
        this.id = id;
        this.balance = balance;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getBalance() {
        return balance;
    }

    public void setBalance(double balance) {
        this.balance = balance;
    }
}
