package com.bulletjournal.filters;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.AuthConfig;
import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.SystemController;
import com.bulletjournal.controller.UserController;
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

@Component
@Order(0)
public class AuthFilter implements Filter {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    private AuthConfig authConfig;

    @Autowired
    private SSOConfig ssoConfig;

    //this method will be called by container when we send any request
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
                    MDC.put(UserClient.USER_NAME_KEY, username);
                    LOGGER.info("User " + username + " logged in");
                    break;
                }
            }
        }

        if (username == null) {
            if (request.getRequestURI().startsWith(SystemController.PUBLIC_ITEM_ROUTE_PREFIX)) {
                LOGGER.info("Bypassing AuthFilter");
            } else if (this.authConfig.isEnableDefaultUser()) {
                username = this.authConfig.getDefaultUsername();
                MDC.put(UserClient.USER_NAME_KEY, username);
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
            response.addHeader("Location", this.ssoConfig.getEndpoint());
        }
        chain.doFilter(req, res);
    }

}