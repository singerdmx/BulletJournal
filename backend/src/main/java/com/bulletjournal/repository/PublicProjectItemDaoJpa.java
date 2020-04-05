package com.bulletjournal.repository;

import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.*;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;
import java.time.Instant;
import java.time.ZonedDateTime;

@Repository
public class PublicProjectItemDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(PublicProjectItemDaoJpa.class);

    @Autowired
    private PublicProjectItemRepository publicProjectItemRepository;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> String generatePublicItemLink(T projectItem, String requester, Long ttl) {
        String uuid = RandomStringUtils.randomAlphanumeric(8);
        User user = this.userDaoJpa.getByName(requester);
        PublicProjectItem publicProjectItem = new PublicProjectItem(uuid, requester);
        if (ttl != null) {
            ZonedDateTime zonedDateTime = ZonedDateTimeHelper.getNow(user.getTimezone());
            Instant instant = zonedDateTime.plusDays(ttl).toInstant();
            publicProjectItem.setExpirationTime(Timestamp.from(instant));
        }

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
        this.publicProjectItemRepository.save(publicProjectItem);
        return uuid;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> T getPublicItem(String uuid) {
        PublicProjectItem publicProjectItem = this.publicProjectItemRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("PublicProjectItem " + uuid + " not found"));

        T item;
        if (publicProjectItem.getNote() != null) {
            item = (T) publicProjectItem.getNote();
        } else if (publicProjectItem.getTask() != null) {
            item = (T) publicProjectItem.getTask();
        } else {
            throw new IllegalArgumentException();
        }

        return item;
    }
}
