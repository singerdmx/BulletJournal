package com.bulletjournal.repository.factory;

import java.util.List;

public interface Etaggable {

    List<String> findAffectedUsernames(String contentId);

    String getUserEtag(String username);
}

