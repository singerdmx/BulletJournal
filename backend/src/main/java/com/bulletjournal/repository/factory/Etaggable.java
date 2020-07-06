package com.bulletjournal.repository.factory;

import java.util.List;
import java.util.Set;

public interface Etaggable {

    List<String> findAffectedUsernames(Set<String> contentIds);

    String getUserEtag(String username);
}

