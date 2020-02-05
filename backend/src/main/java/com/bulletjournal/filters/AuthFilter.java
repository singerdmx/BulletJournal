package com.bulletjournal.filters;

import java.io.IOException;
import java.util.Enumeration;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.AuthConfig;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class AuthFilter implements Filter {
    private static final Logger LOGGER = LoggerFactory.getLogger(AuthFilter.class);

    @Autowired
    private AuthConfig authConfig;

    @Autowired
    private UserClient userClient;

    //this method will be called by container when we send any request
    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {
        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        HttpServletRequest httpRequest = (HttpServletRequest) request;
        Enumeration<String> headerNames = httpRequest.getHeaderNames();

        String username = null;
        if (headerNames != null) {
            while (headerNames.hasMoreElements()) {
                String name = headerNames.nextElement();
                if (UserClient.USER_NAME_KEY.equals(name)) {
                    username = httpRequest.getHeader(name);
                }
                LOGGER.info("Header: " + name + " value:" + httpRequest.getHeader(name));
            }
        }

        if (username == null && this.authConfig.isEnableDefaultUser()) {
            username = this.authConfig.getDefaultUsername();
        }

        if (username == null) {
            // 401
        }
        MDC.put(UserClient.USER_NAME_KEY, username);
        chain.doFilter(req, res);

    }

}