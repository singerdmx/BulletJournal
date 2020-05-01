package com.bulletjournal.filters.rate.limiting;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.MDCConfig;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class TokenBucket {

    @Autowired
    private MDCConfig mdcConfig;

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
        return false;
    }

    private boolean isLimitExceededByFileUpload() {
        // FileController
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return false;
    }

    private boolean isLimitExceededByUser() {
        // For RateLimitFilter
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return false;
    }
}
