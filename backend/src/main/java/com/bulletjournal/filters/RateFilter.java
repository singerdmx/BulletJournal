package com.bulletjournal.filters;


import com.bulletjournal.filters.rate.limiting.TokenBucket;
import com.bulletjournal.filters.rate.limiting.TokenBucketType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import javax.servlet.*;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static org.hibernate.bytecode.BytecodeLogger.LOGGER;

@Component
@Order(1)
public class RateFilter implements Filter {

    @Autowired
    private TokenBucket tokenBucket;

    @Override
    public void doFilter(ServletRequest req, ServletResponse res, FilterChain chain) throws IOException, ServletException {

        HttpServletResponse response = (HttpServletResponse) res;
        HttpServletRequest request = (HttpServletRequest) req;

        if (AuthFilter.shouldBypass(request.getRequestURI())) {
            if (this.tokenBucket.isLimitExceeded(TokenBucketType.PUBLIC_ITEM)) {
                LOGGER.error(request.getRequestURI() + " api limit exceeded");
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // 429
                return;
            }
        } else {
            if (this.tokenBucket.isLimitExceeded(TokenBucketType.USER)) {
                LOGGER.error("User requests limit exceeded");
                response.setStatus(HttpStatus.TOO_MANY_REQUESTS.value()); // 429
                return;
            }
        }

        chain.doFilter(req, res);
    }

    @Override
    public void destroy() {

    }

}
