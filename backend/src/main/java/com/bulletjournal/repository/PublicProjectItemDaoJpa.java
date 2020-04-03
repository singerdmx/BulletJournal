package com.bulletjournal.repository;

import com.bulletjournal.repository.models.ProjectItemModel;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Repository;

@Repository
public class PublicProjectItemDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(PublicProjectItemDaoJpa.class);

    public <T extends ProjectItemModel> String generatePublicItemLink(T projectItem, String requester, Integer ttl) {
        return null;
    }
}
