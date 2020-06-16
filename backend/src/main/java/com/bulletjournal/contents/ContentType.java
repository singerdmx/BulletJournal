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

    public static ContentType getType(String type) {
        switch (type.toUpperCase()) {
            case "PROJECT":
                return PROJECT;
            case "TASK":
                return TASK;
            case "NOTE":
                return NOTE;
            case "TRANSACTION":
                return TRANSACTION;
            case "GROUP":
                return GROUP;
            case "LABEL":
                return LABEL;
            case "CONTENT":
                return CONTENT;
            default:
                throw new IllegalArgumentException("Invalid Input Type");
        }
    }

}
