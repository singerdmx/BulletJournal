package com.bulletjournal.repository.factory;

import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.GroupDaoJpa;
import com.bulletjournal.repository.NotificationDaoJpa;
import com.bulletjournal.repository.UserGroupDaoJpa;
import com.google.common.collect.ImmutableMap;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
public class EtaggableDaos {

    private final Map<EtagType, Etaggable> daos;

    @Autowired
    public EtaggableDaos(NotificationDaoJpa notificationDaoJpa,
                         GroupDaoJpa groupDaoJpa,
                         UserGroupDaoJpa userGroupDaoJpa) {
        this.daos = ImmutableMap.of(
                EtagType.NOTIFICATION, notificationDaoJpa,
                EtagType.GROUP, groupDaoJpa,
                EtagType.USER_GROUP, userGroupDaoJpa
        );
    }

    public Map<EtagType, Etaggable> getDaos() {
        return daos;
    }
}
