package com.bulletjournal.controller.models;

public enum ContactType {
    FEEDBACK, ISSUE;

    public static String getForumUrl(ContactType type) {
        switch (type) {
            case ISSUE:
                return "https://1o24bbs.com/c/bulletjournal/issue/110";
            case FEEDBACK:
                return "https://1o24bbs.com/c/bulletjournal/feedback/109";
        }
        throw new IllegalArgumentException("Invalid ContactType " + type);
    }

    public static int getForumCategoryID(ContactType type) {
        switch (type) {
            case ISSUE:
                return 110;
            case FEEDBACK:
                return 109;
        }
        throw new IllegalArgumentException("Invalid ContactType " + type);
    }
}
