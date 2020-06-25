package com.bulletjournal.filters;

import com.bulletjournal.config.AuthConfig;
import com.bulletjournal.config.MDCConfig;
import com.bulletjournal.redis.models.LockedIP;
import com.bulletjournal.redis.RedisLockedIPRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MDCFilter implements Filter {

    private static final Logger LOGGER = LoggerFactory.getLogger(MDCFilter.class);

    @Autowired
    MDCConfig mdcConfig;

    @Autowired
    AuthConfig authConfig;

    @Autowired
    RedisLockedIPRepository redisLockedIPRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            final String requestId = extractRequestId(httpRequest);
            final String clientIP = extractClientIp(httpRequest);

            MDC.put(mdcConfig.getDefaultRequestIdKey(), requestId);
            MDC.put(mdcConfig.getDefaultClientIpKey(), clientIP);

            Optional<LockedIP> lockedIPOptional = redisLockedIPRepository.findById(clientIP);
            if (lockedIPOptional.isPresent()) {
                LOGGER.info("IP {} remains locked for {} hour(s)", clientIP,
                        String.format("%.2f", lockedIPOptional.get().getExpirationInHour()));
                httpResponse.addHeader("Reason", "IP is locked");
                httpResponse.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }

            httpResponse.setHeader(mdcConfig.getDefaultRequestIdKey(), requestId);

            chain.doFilter(request, response);
        } finally {
            MDC.remove(mdcConfig.getDefaultRequestIdKey());
            MDC.remove(mdcConfig.getDefaultClientIpKey());
        }
    }

    private String extractRequestId(HttpServletRequest request) {
        final String token;
        String requestId = request.getHeader(mdcConfig.getDefaultRequestIdKey());
        if (!StringUtils.isEmpty(requestId)) {
            token = requestId;
        } else {
            token = UUID.randomUUID().toString().toUpperCase().replace("-", "");
        }
        return token;
    }

    private String extractClientIp(final HttpServletRequest request) {
        final String clientIP;
        if (request.getHeader("X-Forwarded-For") != null) {
            clientIP = request.getHeader("X-Forwarded-For").split(",")[0];
        } else {
            clientIP = request.getRemoteAddr();
        }
        return clientIP;
    }

    @Override
    public void destroy() {

    }
}