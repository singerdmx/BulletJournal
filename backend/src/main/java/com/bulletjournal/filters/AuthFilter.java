package com.bulletjournal.filters;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.AuthConfig;
import com.bulletjournal.config.VersionConfig;
import com.bulletjournal.controller.GoogleCalendarController;
import com.bulletjournal.controller.UserController;
import com.bulletjournal.redis.models.LockedUser;
import com.bulletjournal.redis.RedisLockedUserRepository;
import com.google.common.collect.ImmutableList;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;
import java.util.List;
import java.util.Optional;

@Component
@Order(0)
public class AuthFilter implements Filter {
    private static final List<String> BYPASS_WHITE_LIST_ROUTES = ImmutableList.of(
            "/api/public/", GoogleCalendarController.CHANNEL_NOTIFICATIONS_ROUTE,
            GoogleCalendarController.OAUTH_CALL_BACK);
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    private AuthConfig authConfig;

    @Autowired
    private VersionConfig versionConfig;

    @Autowired
    private RedisLockedUserRepository redisLockedUserRepository;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain)
            throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;
        Enumeration<String> headerNames = request.getHeaderNames();

        String username = null;
        if (headerNames != null) {
            while (headerNames.hasMoreElements()) {
                String name = headerNames.nextElement();
                String val = request.getHeader(name);
                if (UserClient.USER_NAME_KEY.equals(name)) {

                    username = URLDecoder.decode(val, StandardCharsets.UTF_8.toString());

                    Optional<LockedUser> lockedUserOptional = redisLockedUserRepository.findById(username);
                    if (lockedUserOptional.isPresent()) {
                        LOGGER.info("User {} remains locked for {} hour(s)", username,
                                String.format("%.2f", lockedUserOptional.get().getExpirationInHour()));
                        response.addHeader("Reason", "User is locked");
                        response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                        return;
                    }

                    MDC.put(UserClient.USER_NAME_KEY, username);
                    LOGGER.info("User " + username + " logged in");
                    break;
                }
            }
        }

        if (username == null) {
            if (this.authConfig.isEnableDefaultUser()) {
                username = this.authConfig.getDefaultUsername();
                MDC.put(UserClient.USER_NAME_KEY, username);
            } else if (shouldBypass(request.getRequestURI())) {
                LOGGER.info("Bypassing AuthFilter");
            } else {
                LOGGER.error(request.getRequestURI() + ": user not logged in");
                response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
                return;
            }
        }

        LOGGER.info(request.getRequestURI());
        if (UserController.LOGOUT_MYSELF_ROUTE.equals(request.getRequestURI())) {
            Cookie cookie = new Cookie("__discourse_proxy", null);
            cookie.setPath("/");
            cookie.setHttpOnly(true);
            cookie.setMaxAge(0);
            response.addCookie(cookie);
            response.addHeader("Location", "https://bulletjournal.us/home/index.html");
        }
        response.addHeader("version", versionConfig.getVersion());
        chain.doFilter(req, res);
    }

    public static boolean shouldBypass(String requestURI) {
        for (String route : BYPASS_WHITE_LIST_ROUTES) {
            if (requestURI.toLowerCase().startsWith(route)) {
                return true;
            }
        }
        return false;
    }
}