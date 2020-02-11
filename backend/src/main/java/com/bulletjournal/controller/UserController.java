package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.SSOConfig;
import com.bulletjournal.controller.models.User;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.view.RedirectView;

@RestController
public class UserController {
    public static final String MYSELF_ROUTE = "/api/myself";
    public static final String LOGOUT_MYSELF_ROUTE = "/api/myself/logout";

    @Autowired
    private UserClient userClient;

    @Autowired
    private SSOConfig ssoConfig;

    @GetMapping(MYSELF_ROUTE)
    public User getMyself() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return userClient.getUser(username);
    }

    @PostMapping(LOGOUT_MYSELF_ROUTE)
    public RedirectView logout() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.userClient.logout(username);
        return new RedirectView(this.ssoConfig.getEndpoint());
    }
}
