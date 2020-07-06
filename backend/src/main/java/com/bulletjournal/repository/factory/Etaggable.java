package com.bulletjournal.repository.factory;

import java.util.Set;

public interface Etaggable {

    Set<String> findAffectedUsernames(Set<String> contentIds);

    String getUserEtag(String username);
}

