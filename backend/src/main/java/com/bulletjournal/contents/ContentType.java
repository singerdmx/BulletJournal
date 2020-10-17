package com.bulletjournal.contents;

public enum ContentType {
    PROJECT, TASK, NOTE, TRANSACTION, GROUP, LABEL, CONTENT, SAMPLE_TASK;

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

    public static ContentType getType(String type) {
        return ContentType.valueOf(type.toUpperCase());
    }

}
