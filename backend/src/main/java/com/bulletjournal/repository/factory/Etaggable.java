package com.bulletjournal.repository.factory;

import com.bulletjournal.redis.models.EtagType;

import java.util.Set;

public interface Etaggable {

    Set<String> findAffectedUsernames(Set<String> contentIds, EtagType etagType);

    String getUserEtag(String username);
}

