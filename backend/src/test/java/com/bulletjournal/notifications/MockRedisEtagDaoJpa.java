package com.bulletjournal.notifications;

import com.bulletjournal.redis.RedisEtagDaoJpa;
import com.bulletjournal.redis.models.Etag;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;


public class MockRedisEtagDaoJpa extends RedisEtagDaoJpa {

    private List<Etag> etags = Collections.synchronizedList(new ArrayList<>());

    @Override
    public synchronized void create(List<EtagEvent> etagEvents) {
        etagEvents.forEach(event -> {
            Etag etag = new Etag();
            etag.setIndex("BulletJournal", event.getEtagType());
            etag.setEtag("TestEtag");
            etags.add(etag);
        });
    }

}
