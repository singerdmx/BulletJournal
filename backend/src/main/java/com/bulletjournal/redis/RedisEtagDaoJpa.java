package com.bulletjournal.redis;

import com.bulletjournal.messaging.MessagingService;
import com.bulletjournal.notifications.EtagEvent;
import com.bulletjournal.redis.models.Etag;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.factory.Etaggable;
import com.bulletjournal.repository.factory.EtaggableDaos;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Repository
public class RedisEtagDaoJpa {

    private static final Logger LOGGER = LoggerFactory.getLogger(RedisEtagDaoJpa.class);

    @Autowired
    private RedisEtagRepository redisEtagRepository;

    @Autowired
    private EtaggableDaos daos;

    @Autowired
    private MessagingService messagingService;

    /**
     * Batch cache a list of etags instance into Redis.
     *
     * @param etagEvents a list of etag event instance contains contentId and EtagType
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(List<EtagEvent> etagEvents) {
        if (etagEvents.isEmpty()) {
            return;
        }

        Map<EtagType, Set<String>> aggregateMap = new HashMap<>();
        etagEvents.forEach(e -> aggregateMap.computeIfAbsent(e.getEtagType(), n -> new HashSet<>()).add(e.getContentId()));

        mergeEventToOtherEvent(EtagType.USER_GROUP, EtagType.GROUP, aggregateMap);

        // Now EtagType only have GROUP, GROUP_DELETE, NOTIFICATION and NOTIFICATION_DELETE
        List<Etag> etags = computeEtags(aggregateMap);
        this.batchCache(etags);
    }

    public void singleCache(String username, EtagType type, String etag) {
        this.redisEtagRepository.save(new Etag(username, type, etag));
    }

    /**
     * Batch store a list of Etag instances
     *
     * @param etags a list of etag instances
     */
    public void batchCache(List<Etag> etags) {
        this.redisEtagRepository.saveAll(etags);
    }

    /**
     * Get etag by the key constructed by username and etag type
     *
     * @param username the requester's username string
     * @param etagType the etag type enum
     * @return an etag instance
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Etag findEtagsByIndex(String username, EtagType etagType) {
        Preconditions.checkNotNull(username, "findEtagsByIndex: username cannot be null");
        Preconditions.checkNotNull(etagType, "findEtagsByIndex: etagType cannot be null");
        return this.redisEtagRepository.findByIndex(username + "@" + etagType.toString());
    }

    /**
     * Compute etag values for a set of unique events.
     * <p>
     * 1. Aggregate content ids into a HashMap with EtagType as Key and Set of Content Ids as value.
     * 2. Iterate through the Etag Type in Map's KeySet and get Dao based on Etag Type.
     * 3. Fetch the list of affected users from the Dao and create new Etag instance.
     * 4. Added etag instance to return list
     *
     * @param aggregateMap a map of etag type and etag list
     * @return a list of etag instances
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    List<Etag> computeEtags(Map<EtagType, Set<String>> aggregateMap) {
        List<Etag> etags = new ArrayList<>();

        for (EtagType type : aggregateMap.keySet()) {
            Set<String> contentIds = aggregateMap.get(type);
            if (contentIds.isEmpty()) {
                continue;
            }
            Etaggable dao = daos.getDaos().get(type);
            Set<String> affectedUsernames = dao.findAffectedUsernames(contentIds, type); // Batch get affected usernames
            contentIds.clear();
            contentIds.addAll(affectedUsernames);
        }
        try {
            messagingService.sendEtagUpdateNotificationToUsers(
                aggregateMap.getOrDefault(EtagType.NOTIFICATION, Collections.emptySet()));
        } catch (Exception e) {
            LOGGER.error("Got exception when sending notification: {}", e.toString());
        }
        mergeEventToOtherEvent(EtagType.GROUP_DELETE, EtagType.GROUP, aggregateMap);
        mergeEventToOtherEvent(EtagType.NOTIFICATION_DELETE, EtagType.NOTIFICATION, aggregateMap);

        // Now EtagType only have GROUP and NOTIFICATION
        for (EtagType type : aggregateMap.keySet()) {
            Set<String> affectedUsernames = aggregateMap.get(type);
            Etaggable dao = daos.getDaos().get(type);
            affectedUsernames.forEach(username -> {
                Etag etag = new Etag(username, type, dao.getUserEtag(username));
                etags.add(etag);
            });
        }
        return etags;
    }

    private void mergeEventToOtherEvent(EtagType from, EtagType to, Map<EtagType, Set<String>> aggregateMap) {
        aggregateMap.computeIfAbsent(to, n -> new HashSet<>())
                .addAll(aggregateMap.getOrDefault(from, Collections.emptySet()));
        aggregateMap.remove(from);
    }
}
