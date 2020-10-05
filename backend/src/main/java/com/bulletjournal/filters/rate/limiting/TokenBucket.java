package com.bulletjournal.filters.rate.limiting;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.MDCConfig;
import com.bulletjournal.config.RateConfig;
import com.bulletjournal.config.RedisConfig;
import com.bulletjournal.redis.models.LockedIP;
import com.bulletjournal.redis.models.LockedUser;
import com.bulletjournal.redis.RedisLockedIPRepository;
import com.bulletjournal.redis.RedisLockedUserRepository;
import io.github.bucket4j.*;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBucket {

    private final Map<String, Bucket> bucketsUser = new ConcurrentHashMap<>();
    private final Map<String, Bucket> bucketsFileUpload = new ConcurrentHashMap<>();
    private final Map<String, Bucket> bucketsPublicItem = new ConcurrentHashMap<>();
    @Autowired
    private MDCConfig mdcConfig;
    @Autowired
    private RateConfig rateConfig;
    @Autowired
    private UserClient userClient;
    @Autowired
    private RedisConfig redisConfig;
    @Autowired
    private RedisLockedUserRepository redisLockedUserRepository;
    @Autowired
    private RedisLockedIPRepository redisLockedIPRepository;

    public TokenBucket() {
    }

    public boolean isLimitExceeded(TokenBucketType type) {
        switch (type) {
            case USER:
                return isLimitExceededByUser();
            case FILE_UPLOAD:
                return isLimitExceededByFileUpload();
            case PUBLIC_ITEM:
                return isLimitExceededByPublicItem();
            default:
                throw new IllegalStateException();
        }
    }

    private boolean isLimitExceededByPublicItem() {
        String ip = MDC.get(this.mdcConfig.getDefaultClientIpKey());
        boolean consumed = consumeToken(ip, bucketsPublicItem, rateConfig.getPublicItem());

        if (!consumed) {
            redisLockedIPRepository.save(new LockedIP(ip, "Get public item requests exceeded limit"));
        }

        return !consumed;
    }

    private boolean isLimitExceededByFileUpload() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        boolean consumed = consumeToken(username, bucketsUser, rateConfig.getFileUpload());

        if (!consumed) {
            redisLockedUserRepository.save(new LockedUser(username, "User file upload requests exceeded limit"));
        }
        return !consumed;
    }

    private boolean isLimitExceededByUser() {

        // For RateLimitFilter
        String username = MDC.get(UserClient.USER_NAME_KEY);

        int limit = this.rateConfig.getUser();
        boolean consumed = consumeToken(username, bucketsUser, limit);

        if (!consumed) {
            redisLockedUserRepository.save(new LockedUser(username, "User API requests exceeded limit"));
        }

        return !consumed;
    }

    private boolean consumeToken(String subject, Map<String, Bucket> buckets, int limit) {
        if (subject == null) {
            return true;
        }
        Bucket requestBucket = buckets.computeIfAbsent(subject, key -> standardBucket(limit));
        ConsumptionProbe probe = requestBucket.tryConsumeAndReturnRemaining(1);
        return probe.isConsumed();
    }

    private Bucket standardBucket(int limit) {
        return Bucket4j.builder()
                .addLimit(Bandwidth.classic(limit, Refill.intervally(limit, Duration.ofMinutes(1))))
                .build();
    }

    public void clearBucket() {
        bucketsUser.clear();
        bucketsFileUpload.clear();
        bucketsPublicItem.clear();
    }
}