package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.ContentExport;
import com.bulletjournal.messaging.MessagingService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class ExportContentController {

    private static final String EXPORT_PUBLIC_CONTENT_ROUTE = "/api/content/export";
    private static final Logger LOGGER = LoggerFactory.getLogger(ExportContentController.class);

    @Autowired
    private MessagingService messagingService;

    @PostMapping(EXPORT_PUBLIC_CONTENT_ROUTE)
    public void exportContent(@Valid @RequestBody ContentExport contentExport) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.messagingService.sendExportContentToUsers(username, contentExport);
    }
}
