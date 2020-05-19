package com.bulletjournal.contents;

public enum ContentAction {
    ALL_ACTIONS, COMPLETE_TASK, UNCOMPLETE_TASK, ADD_PROJECT, DELETE_PROJECT, UPDATE_PROJECT, ADD_TASK, DELETE_TASK,
    UPDATE_TASK, ADD_NOTE, DELETE_NOTE, UPDATE_NOTE, ADD_TRANSACTION, DELETE_TRANSACTION, UPDATE_TRANSACTION,
    ADD_CONTENT, DELETE_CONTENT, UPDATE_CONTENT;

    public static String getContentLink(ContentAction action, Long contentId) {
        switch (action) {
            case COMPLETE_TASK:
            case UNCOMPLETE_TASK:
            case ADD_TASK:
            case UPDATE_TASK:
                return String.format(ContentType.getContentLink(ContentType.TASK, contentId));
        }
        return null;
    }
}
