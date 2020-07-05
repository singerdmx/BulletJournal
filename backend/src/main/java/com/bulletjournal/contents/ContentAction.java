package com.bulletjournal.contents;

public enum ContentAction {
    ALL_ACTIONS, COMPLETE_TASK, UNCOMPLETE_TASK, ADD_PROJECT, DELETE_PROJECT, UPDATE_PROJECT, ADD_TASK, DELETE_TASK,
    UPDATE_TASK, MOVE_TASK, ADD_NOTE, DELETE_NOTE, UPDATE_NOTE, MOVE_NOTE, ADD_TRANSACTION,
    DELETE_TRANSACTION, UPDATE_TRANSACTION, MOVE_TRANSACTION, ADD_TASK_CONTENT, DELETE_TASK_CONTENT,
    UPDATE_TASK_CONTENT, ADD_NOTE_CONTENT, DELETE_NOTE_CONTENT, UPDATE_NOTE_CONTENT, ADD_TRANSACTION_CONTENT,
    DELETE_TRANSACTION_CONTENT, UPDATE_TRANSACTION_CONTENT, SHARE;

    public static String getContentLink(ContentAction action, Long contentId, ContentType contentType) {
        switch (action) {
            case COMPLETE_TASK:
                return String.format("/completedTask/%d", contentId);
            case UNCOMPLETE_TASK:
            case ADD_TASK:
            case UPDATE_TASK:
            case MOVE_TASK:
            case ADD_TASK_CONTENT:
            case UPDATE_TASK_CONTENT:
            case DELETE_TASK_CONTENT:
                return String.format(ContentType.getContentLink(ContentType.TASK, contentId));
            case ADD_NOTE:
            case UPDATE_NOTE:
            case MOVE_NOTE:
            case ADD_NOTE_CONTENT:
            case UPDATE_NOTE_CONTENT:
            case DELETE_NOTE_CONTENT:
                return String.format(ContentType.getContentLink(ContentType.NOTE, contentId));
            case ADD_TRANSACTION:
            case UPDATE_TRANSACTION:
            case MOVE_TRANSACTION:
            case ADD_TRANSACTION_CONTENT:
            case UPDATE_TRANSACTION_CONTENT:
            case DELETE_TRANSACTION_CONTENT:
                return String.format(ContentType.getContentLink(ContentType.TRANSACTION, contentId));
            case ADD_PROJECT:
            case UPDATE_PROJECT:
                return String.format(ContentType.getContentLink(ContentType.PROJECT, contentId));
            case SHARE:
                if (ContentType.TASK.equals(contentType)) {
                    return String.format(ContentType.getContentLink(ContentType.TASK, contentId));
                }
                if (ContentType.NOTE.equals(contentType)) {
                    return String.format(ContentType.getContentLink(ContentType.NOTE, contentId));
                }
                return null;
        }
        return null;
    }

    public static String getContentLink(ContentAction action, Long contentId) {
        return getContentLink(action, contentId, null);
    }
}
