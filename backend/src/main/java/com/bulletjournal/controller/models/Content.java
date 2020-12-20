package com.bulletjournal.controller.models;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.utils.EtagGenerator;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.Arrays;
import java.util.List;

public class Content {
    private static final Logger LOGGER = LoggerFactory.getLogger(Content.class);
    private static final Gson GSON = new Gson();

    @NotNull
    private Long id;

    @NotNull
    private User owner;

    @NotBlank
    private String text;

    private String etag;

    private String baseText;

    @NotNull
    private Long createdAt;

    @NotNull
    private Long updatedAt;

    private Revision[] revisions;

    public Content() {
    }

    public Content(@NotNull Long id, @NotNull User owner,
                   @NotBlank String text, String baseText,
                   @NotNull Long createdAt, @NotNull Long updatedAt,
                   String revisions) {
        this.id = id;
        this.owner = owner;
        this.text = text;
        this.etag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, text);
        LOGGER.info("etag {} for {}", this.etag, text);
        this.baseText = baseText;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        try {
            this.revisions = GSON.fromJson(revisions, Revision[].class);
        } catch (Exception ex) {
            LOGGER.error("Fail to deserialize json: " + revisions, ex);
        }
        if (this.revisions == null) {
            this.revisions = new Revision[0];
        }
        deleteRevisionDiff();
    }

    public static List<Content> addOwnerAvatar(List<Content> contents, UserClient userClient) {
        contents.forEach(c -> addOwnerAvatar(c, userClient));
        return contents;
    }

    public static Content addOwnerAvatar(Content content, UserClient userClient) {
        content.setOwner(userClient.getUser(content.getOwner().getName()));
        if (content.revisions != null ) {
            Revision.addAvatar(Arrays.asList(content.revisions), userClient);
        }
        return content;
    }

    private void deleteRevisionDiff() {
        if (revisions != null) {
            for (Revision revision : revisions) {
                revision.setDiff(null);
            }
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getOwner() {
        return owner;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
        this.etag = EtagGenerator.generateEtag(EtagGenerator.HashAlgorithm.MD5,
                EtagGenerator.HashType.TO_HASHCODE, text);
    }

    public String getBaseText() {
        return baseText;
    }

    public void setBaseText(String baseText) {
        this.baseText = baseText;
    }

    public Long getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Long createdAt) {
        this.createdAt = createdAt;
    }

    public Long getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Long updatedAt) {
        this.updatedAt = updatedAt;
    }

    public Revision[] getRevisions() {
        return revisions;
    }

    public void setRevisions(Revision[] revisions) {
        this.revisions = revisions;
    }

    public String getEtag() {
        return etag;
    }

    public void setEtag(String etag) {
        this.etag = etag;
    }

    @Override
    public String toString() {
        return "Content{" +
                "text='" + text + '\'' +
                '}';
    }
}
