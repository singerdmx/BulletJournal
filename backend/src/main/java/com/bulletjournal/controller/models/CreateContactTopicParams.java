package com.bulletjournal.controller.models;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

public class CreateContactTopicParams {
    @NotNull
    private ContactType contactType;
    @NotBlank
    private String title;
    @NotBlank
    private String content;

    public CreateContactTopicParams() {
    }

    public CreateContactTopicParams(ContactType contactType, String title, String content) {
        this.contactType = contactType;
        this.title = title;
        this.content = content;
    }

    public ContactType getContactType() {
        return contactType;
    }

    public void setContactType(ContactType contactType) {
        this.contactType = contactType;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
