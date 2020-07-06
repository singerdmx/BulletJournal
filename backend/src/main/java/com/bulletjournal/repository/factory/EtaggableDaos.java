package com.bulletjournal.repository.factory;

import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.GroupDaoJpa;
import com.bulletjournal.repository.NotificationDaoJpa;
import com.bulletjournal.repository.ProjectDaoJpa;
import com.bulletjournal.repository.factory.Etaggable;
import com.google.common.collect.ImmutableMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class EtaggableDaos {

    private Map<EtagType, Etaggable> daos;

    @Autowired
    public EtaggableDaos(NotificationDaoJpa notificationDaoJpa,
                         GroupDaoJpa groupDaoJpa,
                         ProjectDaoJpa projectDaoJpa) {
        this.daos = ImmutableMap.of(
                EtagType.NOTIFICATION, notificationDaoJpa,
                EtagType.GROUP, groupDaoJpa,
                EtagType.PROJECT, projectDaoJpa
        );
    }

    public Map<EtagType, Etaggable> getDaos() {
        return daos;
    }
}
