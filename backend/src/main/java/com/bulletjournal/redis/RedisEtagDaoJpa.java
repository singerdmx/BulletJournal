package com.bulletjournal.redis;

import com.bulletjournal.notifications.CreateEtagEvent;
import com.bulletjournal.redis.models.Etag;
import com.bulletjournal.redis.models.EtagType;
import com.bulletjournal.repository.factory.Etaggable;
import com.bulletjournal.repository.factory.EtaggableDaos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Repository
public class RedisEtagDaoJpa {

    @Autowired
    private RedisEtagRepository redisEtagRepository;

    @Autowired
    private EtaggableDaos daos;

    /**
     * Batch cache a list of etags instance into Redis.
     *
     * @param etagEvents a list of etag event instance contains contentId and EtagType
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(List<CreateEtagEvent> etagEvents) {
        Set<CreateEtagEvent> uniqueEvents = new HashSet<>(etagEvents);
        List<Etag> etags = computeEtags(uniqueEvents);
        this.batchCache(etags);
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
    public Etag findEtagsByIndex(String username, EtagType etagType) {
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
     * @param events a list of unique event
     * @return a list of etag instances
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Etag> computeEtags(Set<CreateEtagEvent> events) {
        List<Etag> etags = new ArrayList<>();
        Map<EtagType, Set<String>> aggregateMap = new HashMap<>();
        events.forEach(e -> aggregateMap.computeIfAbsent(e.getEtagType(), n -> new HashSet<>()).add(e.getContentId()));

        // merge USER_PROJECTS and PROJECT
        aggregateMap.computeIfAbsent(EtagType.PROJECT, n -> new HashSet<>()).addAll(
                aggregateMap.getOrDefault(EtagType.USER_PROJECTS, Collections.emptySet()));
        aggregateMap.remove(EtagType.USER_PROJECTS);

        for (EtagType type : aggregateMap.keySet()) {
            Set<String> contentIds = aggregateMap.get(type);
            Etaggable dao = daos.getDaos().get(type);
            Set<String> affectedUsernames = dao.findAffectedUsernames(contentIds); // Batch get affected usernames
            affectedUsernames.forEach(username -> {
                Etag etag = new Etag(username, type, dao.getUserEtag(username));
                etags.add(etag);
            });
        }
        return etags;
    }
}
