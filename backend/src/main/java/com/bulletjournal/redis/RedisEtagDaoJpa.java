package com.bulletjournal.redis;

import com.bulletjournal.notifications.CreateEtagEvent;
import com.bulletjournal.redis.models.Etag;
import com.bulletjournal.repository.factory.Etaggable;
import com.bulletjournal.repository.factory.EtaggableDaos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Repository
public class RedisEtagDaoJpa {

    @Autowired
    private RedisEtagRepository redisEtagRepository;

    @Autowired
    private EtaggableDaos daos;

    /**
     * Batch create a list of etags instance in Redis Cache.
     *
     * @param etagEvents a list of etag event instance contains contentId and EtagType
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void create(List<CreateEtagEvent> etagEvents) {
        Set<CreateEtagEvent> uniqueEvents = new HashSet<>(etagEvents);
        List<Etag> etags = computeEtags(uniqueEvents);
        this.redisEtagRepository.saveAll(etags);
    }

    /**
     * Compute etag value for each event.
     * <p>
     * 1. Get dao based on EtagType.
     * 2. Fetch the list of affected users from the Dao from Step 1.
     * 3. Loop through each username and create Etag instance.
     *
     * @param events a list of unique event
     * @return a list of etag values
     */
    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Etag> computeEtags(Set<CreateEtagEvent> events) {
        List<Etag> etags = new ArrayList<>();
        events.forEach(event -> {
            Etaggable dao = daos.getDaos().get(event.getEtagType());
            List<String> affectedUsernames = dao.findAffectedUsernames(event.getContentId());
            affectedUsernames.forEach(username -> {
                Etag etag = new Etag(username, event.getEtagType(), dao.getUserEtag(username));
                etags.add(etag);
            });
        });
        return etags;
    }
}
