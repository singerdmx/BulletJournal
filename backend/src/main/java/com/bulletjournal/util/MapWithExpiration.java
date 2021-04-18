package com.bulletjournal.util;

import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.Executors;
import java.util.concurrent.ScheduledExecutorService;
import java.util.concurrent.TimeUnit;

public class MapWithExpiration {

    private static class Value {
        Object val;
        long expirationTime;

        Value(Object val, long expirationTime) {
            this.val = val;
            this.expirationTime = expirationTime;
        }
    }

    private final ScheduledExecutorService scheduler = Executors.newSingleThreadScheduledExecutor();

    private ConcurrentHashMap<String, Value> map = new ConcurrentHashMap<>();

    /**
     * O(1)
     */
    public Object get(String k) {
        Value val = this.map.get(k);
        if (val == null) {
            return null;
        }

        if (val.expirationTime <= this.getCurrentTime()) {
            return null;
        }
        return val.val;
    }

    /**
     * @return null if a new key is put, non-null if the key already exists
     */
    public Value putIfAbsent(final String k, Object v, long ttl) {
        if (ttl <= 0) {
            return null;
        }

        long expirationTime = this.getCurrentTime() + ttl;
        Value res = this.map.putIfAbsent(k, new Value(v, expirationTime));
        if (res == null) {
            // not null means key already exists
            // null means a new key is put
            this.scheduler.schedule(() -> {
                Value val = this.map.get(k);
                if (val != null && val.expirationTime < this.getCurrentTime()) {
                    this.map.remove(k);
                }
            }, ttl, TimeUnit.MILLISECONDS);
        }
        return res;
    }

    private Long currentTime; // for testing purpose

    public void setCurrentTime(Long currentTime) {
        this.currentTime = currentTime;
    }

    protected long getCurrentTime() {
        if (this.currentTime != null) {
            return this.currentTime;
        }
        return System.currentTimeMillis();
    }
}
