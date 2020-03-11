package com.bulletjournal.filters;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.AuthConfig;
import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.UserController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

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
                    LOGGER.info("User " + username + " logged in");
                    break;
                }
            }
        }

        if (username == null && this.authConfig.isEnableDefaultUser()) {
            username = this.authConfig.getDefaultUsername();
        }

        if (username == null) {
            LOGGER.error(request.getRequestURI() + ": user not logged in");
            response.sendError(HttpServletResponse.SC_UNAUTHORIZED);
            return;
        }

        MDC.put(UserClient.USER_NAME_KEY, username);
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