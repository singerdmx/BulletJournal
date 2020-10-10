package com.bulletjournal.repository;

import com.bulletjournal.controller.models.SharableLink;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.Note;
import com.bulletjournal.repository.models.ProjectItemModel;
import com.bulletjournal.repository.models.PublicProjectItem;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.util.StringUtil;
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
import java.util.List;
import java.util.Objects;

@Repository
public class PublicProjectItemDaoJpa {
    private static final Logger LOGGER = LoggerFactory.getLogger(PublicProjectItemDaoJpa.class);

    @Autowired
    private PublicProjectItemRepository publicProjectItemRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> SharableLink generatePublicItemLink(T projectItem, String requester, Long ttl) {
        String uuid = RandomStringUtils.randomAlphanumeric(StringUtil.UUID_LENGTH);
        PublicProjectItem publicProjectItem = new PublicProjectItem(uuid, requester);
        if (ttl != null) {
            ZonedDateTime zonedDateTime = ZonedDateTimeHelper.getNow();
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
        publicProjectItem = this.publicProjectItemRepository.save(publicProjectItem);
        return publicProjectItem.toSharableLink();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> T getPublicItem(String uuid) {
        PublicProjectItem publicProjectItem = this.publicProjectItemRepository.findById(uuid)
                .orElseThrow(() -> new ResourceNotFoundException("PublicProjectItem " + uuid + " not found"));

        if (publicProjectItem.hasExpirationTime() &&
                publicProjectItem.getExpirationTime().compareTo(Timestamp.from(Instant.now())) < 0) {
            LOGGER.info("Link {} expired", uuid);
            this.publicProjectItemRepository.delete(publicProjectItem);
            return null;
        }

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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> List<PublicProjectItem> getPublicItemLinks(T projectItem) {
        List<PublicProjectItem> publicProjectItems;
        switch (projectItem.getContentType()) {
            case TASK:
                publicProjectItems = this.publicProjectItemRepository.findByTask((Task) projectItem);
                break;
            case NOTE:
                publicProjectItems = this.publicProjectItemRepository.findByNote((Note) projectItem);
                break;
            default:
                throw new IllegalArgumentException();
        }

        return publicProjectItems;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public <T extends ProjectItemModel> void revokeSharableLink(T projectItem, String link) {
        PublicProjectItem publicProjectItem = this.getPublicItemLinks(projectItem).stream()
                .filter(item -> Objects.equals(item.getId(), link))
                .findAny().orElseThrow(() -> new ResourceNotFoundException("Link " + link + " not found"));
        this.publicProjectItemRepository.delete(publicProjectItem);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteAllExpiredPublicItems() {
        this.publicProjectItemRepository.deleteByExpirationTimeBefore(new Timestamp(System.currentTimeMillis()));
    }
}
