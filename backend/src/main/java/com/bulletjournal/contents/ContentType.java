package com.bulletjournal.contents;

public enum ContentType {
    PROJECT, TASK, NOTE, TRANSACTION, GROUP, LABEL, CONTENT, SAMPLE_TASK, BANK_ACCOUNT;

    public static String getContentLink(ContentType type, Long contentId) {
        switch (type) {
            case GROUP:
                return String.format("/groups/group%d", contentId);
            case PROJECT:
                return String.format("/projects/%d", contentId);
            case TASK:
            case NOTE:
            case TRANSACTION:
                return String.format("/" + type.name().toLowerCase() + "/%d", contentId);
            case SAMPLE_TASK:
                return String.format("/admin/sampleTasks/%d", contentId);
        }

        return null;
    }

    public static ContentType getContentTypeFromLink(String link) {
        if (link.startsWith("/groups/group")) {
            return ContentType.GROUP;
        }

        if (link.startsWith("/projects/")) {
            return ContentType.PROJECT;
        }

        if (link.startsWith("/task/")) {
            return ContentType.TASK;
        }

        if (link.startsWith("/note/")) {
            return ContentType.NOTE;
        }

        if (link.startsWith("/transaction/")) {
            return ContentType.TRANSACTION;
        }

        if (link.startsWith("/admin/sampleTasks/")) {
            return ContentType.SAMPLE_TASK;
        }

        throw new IllegalArgumentException("link " + link + " is not valid");
    }

    public static ContentType getType(String type) {
        return ContentType.valueOf(type.toUpperCase());
    }

}
