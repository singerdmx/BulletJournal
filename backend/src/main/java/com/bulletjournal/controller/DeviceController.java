package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.AddDeviceTokenParams;
import com.bulletjournal.repository.DeviceTokenDaoJpa;
import com.bulletjournal.repository.models.DeviceToken;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.Objects;

@RestController
public class DeviceController {

    protected static final String DEVICE_TOKEN_ROUTE = "/api/deviceTokens";

    protected static final String REPLACED_RESPONSE = "token replaced";

    protected static final String CREATED_RESPONSE = "token created";

    protected static final String EXISTED_RESPONSE = "token already exists";

    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceController.class);

    @Autowired
    private DeviceTokenDaoJpa deviceTokenDaoJpa;

    @PostMapping(DEVICE_TOKEN_ROUTE)
    public String createDeviceToken(@RequestBody AddDeviceTokenParams addDeviceTokenParams) {
        String token = addDeviceTokenParams.getToken();
        String userName = MDC.get(UserClient.USER_NAME_KEY);
        DeviceToken existingToken = deviceTokenDaoJpa.get(token);
        if (existingToken == null) {
            LOGGER.info("Token {} added for user {}", token, userName);
            deviceTokenDaoJpa.create(token, userName);
            return CREATED_RESPONSE;
        }
        if (!Objects.equals(existingToken.getUsername(), userName)) {
            LOGGER.info("Token {} is changed from user {} to user {}",
                token, existingToken.getUsername(), userName);
            deviceTokenDaoJpa.updateUser(existingToken, userName);
            return REPLACED_RESPONSE;
        }
        LOGGER.debug("Same token {} for user {} already exists, no-op",
            token, userName);
        return EXISTED_RESPONSE;
    }
}
