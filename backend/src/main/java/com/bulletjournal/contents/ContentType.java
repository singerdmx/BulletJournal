package com.bulletjournal.contents;

public enum ContentType {
    PROJECT, TASK, NOTE, TRANSACTION, GROUP, LABEL, CONTENT;

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
        }

        return null;
    }

}
