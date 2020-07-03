package com.bulletjournal.redis;

import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.controller.models.Group;
import com.bulletjournal.controller.models.Notification;
import com.bulletjournal.controller.models.Projects;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.bulletjournal.redis.models.Etag;
import com.bulletjournal.repository.GroupDaoJpa;
import com.bulletjournal.repository.NotificationDaoJpa;
import com.bulletjournal.repository.ProjectDaoJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class RedisEtagDaoJpa {

    @Autowired
    private RedisEtagRepository redisEtagRepository;

    @Autowired
    private NotificationDaoJpa notificationDaoJpa;

    @Autowired
    private GroupDaoJpa groupDaoJpa;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    /**
     * Batch create a list of etags instance in Redis Cache.
     * Compute etag value based on username and etag type.
     *
     * @param etags list of etags class objects without etag value
     */
    public void create(List<Etag> etags) {
        etags.forEach(etag -> computeEtag(etag));
        this.redisEtagRepository.saveAll(etags);
    }

    /**
     * Compute etag value based on Etag Object Type
     *
     * @param etag Etag Class contains username, type and null EtagValue
     */
    public void computeEtag(Etag etag) {
        String username = etag.getUsername();
        EtagType etagType = etag.getEtagType();
        String etagValue = null;
        switch (etagType) {
            case NOTIFICATION:
                List<Notification> notificationList = this.notificationDaoJpa.getNotifications(username);
                etagValue = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                        EtagGenerator.HashType.TO_HASHCODE,
                        notificationList);
                break;
            case GROUP:
                List<Group> groupList = this.groupDaoJpa.getGroups(username);
                etagValue = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                        EtagGenerator.HashType.TO_HASHCODE,
                        groupList);
                break;
            case PROJECTS:
                Projects projects = this.projectDaoJpa.getProjects(username);
                String ownedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                        EtagGenerator.HashType.TO_HASHCODE,
                        projects.getOwned());
                String sharedProjectsEtag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                        EtagGenerator.HashType.TO_HASHCODE,
                        projects.getShared());
                etagValue = ownedProjectsEtag + "|" + sharedProjectsEtag;
                break;
            default:
                throw new IllegalStateException("Unknown etag type");
        }

        etag.setEtag(etagValue);
    }
}
