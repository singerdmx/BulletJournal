package com.bulletjournal.repository;

import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.*;
import org.elasticsearch.search.aggregations.support.ValuesSourceAggregationBuilder;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZonedDateTime;
import java.util.Date;
import java.util.UUID;

@Repository
public class PublicProjectItemDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(PublicProjectItemDaoJpa.class);

    @Autowired
    private PublicProjectItemRepository publicProjectItemRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    public <T extends ProjectItemModel> String generatePublicItemLink(T projectItem, String requester, Long ttl) {
        String uuid = UUID.randomUUID().toString();
        User user = this.userDaoJpa.getByName(requester);
        PublicProjectItem publicProjectItem = new PublicProjectItem(requester);
        if (ttl != null) {
            ZonedDateTime zonedDateTime = ZonedDateTimeHelper.getNow(user.getTimezone());
            Instant instant = zonedDateTime.plusDays(ttl).toInstant();
            publicProjectItem.setExpirationTime(Timestamp.from(instant));
        }

        this.publicProjectItemRepository.save(publicProjectItem);
        switch (projectItem.getContentType()) {
            case TASK:
                publicProjectItem.setTask((Task) projectItem);
                break;
            case NOTE:
                publicProjectItem.setNote((Note) projectItem);
                break;
            default:
                throw new IllegalArgumentException();
        }
        return uuid;
    }
}
