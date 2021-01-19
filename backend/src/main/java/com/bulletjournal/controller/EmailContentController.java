package com.bulletjournal.controller;

import com.bulletjournal.controller.models.EmailContentByEmailAddressesParams;
import com.bulletjournal.controller.models.EmailContentByGroupParams;
import com.bulletjournal.controller.models.EmailContentByUsernamesParams;
import com.bulletjournal.repository.EmailContentDaoJpa;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.Valid;

@RestController
public class EmailContentController {

    public static final String EMAIL_CONTENT_BY_USERNAMES_ROUTE = "/api/emailContent/{contentType}/sendByUsernames";
    public static final String EMAIL_CONTENT_BY_GROUP_ROUTE = "/api/emailContent/{contentType}/sendByGroup";
    public static final String EMAIL_CONTENT_BY_EMAIL_ROUTE = "/api/emailContent/{contentType}/sendByEmails";

    @Autowired
    private EmailContentDaoJpa emailContentDaoJpa;

    @PostMapping(EMAIL_CONTENT_BY_USERNAMES_ROUTE)
    public void emailContentByUsernames(
            @PathVariable String contentType,
            @Valid @RequestBody EmailContentByUsernamesParams params) {
        emailContentDaoJpa.sendContentsByUsernames(
                contentType,
                params.getContentParentId(),
                params.getHtmlContent(),
                params.getUsernames()
        );
    }

    @PostMapping(path = EMAIL_CONTENT_BY_GROUP_ROUTE)
    public void setEmailContentByGroup(
            @PathVariable String contentType,
            @Valid @RequestBody EmailContentByGroupParams params) {
        emailContentDaoJpa.sendContentsByGroupName(
                contentType,
                params.getContentParentId(),
                params.getHtmlContent(),
                params.getGroupName()
        );
    }

    @PostMapping(path = EMAIL_CONTENT_BY_EMAIL_ROUTE)
    public void setEmailContentByEmails(
            @PathVariable String contentType,
            @Valid @RequestBody EmailContentByEmailAddressesParams params) {
        emailContentDaoJpa.sendContentsByEmails(
                contentType,
                params.getContentParentId(),
                params.getHtmlContent(),
                params.getEmailAddresses()
        );
    }
}

