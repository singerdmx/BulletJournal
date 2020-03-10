package com.bulletjournal.filters;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.AuthConfig;
import com.bulletjournal.config.MDCConfig;
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
import java.util.UUID;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class MDCFilter implements Filter {

    @Autowired
    MDCConfig mdcConfig;

    @Autowired
    AuthConfig authConfig;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        try {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;

            final String requestId = extractRequestId(httpRequest);
            final String clientIP = extractClientIp(httpRequest);
            final String requester = extractUsername(httpRequest);

            MDC.put(mdcConfig.getDefaultRequestIdKey(), requestId);
            MDC.put(mdcConfig.getDefaultClientIpKey(), clientIP);
            MDC.put(mdcConfig.getDefaultUsernameKey(), requester);

            httpResponse.setHeader(mdcConfig.getDefaultRequestIdKey(), requestId);
            httpResponse.setHeader(mdcConfig.getDefaultUsernameKey(), requester);

            chain.doFilter(request, response);
        } finally {
            MDC.remove(mdcConfig.getDefaultRequestIdKey());
            MDC.remove(mdcConfig.getDefaultClientIpKey());
            MDC.remove(mdcConfig.getDefaultUsernameKey());
        }
    }

    private String extractUsername(HttpServletRequest request) {
        final String username;
        if (!StringUtils.isEmpty(request.getHeader(UserClient.USER_NAME_KEY))) {
            username = request.getHeader(UserClient.USER_NAME_KEY);
        } else if (this.authConfig.isEnableDefaultUser()) {
            username = this.authConfig.getDefaultUsername();
        } else {
            username = "Unknown";
        }
        return username;
    }

    private String extractRequestId(HttpServletRequest request) {
        final String token;
        if (!StringUtils.isEmpty(request.getHeader(mdcConfig.getDefaultRequestIdKey()))) {
            token = request.getHeader("requestId");
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