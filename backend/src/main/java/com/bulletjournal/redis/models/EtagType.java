package com.bulletjournal.redis.models;

import java.util.Objects;

public enum EtagType {
    NOTIFICATION(0, "Notification"),
    GROUP(1, "Group"),
    USER_GROUP(2, "UserGroups"),
    NOTIFICATION_DELETE(3, "NotificationDelete"),
    GROUP_DELETE(4, "GroupDelete"),;

    public final int value;

    public final String text;

    EtagType(int value, String text) {
        this.value = value;
        this.text = text;
    }

    public static EtagType of(String type) {
        for (EtagType etagType : values()) {
            if (Objects.equals(type, etagType.toString())) {
                return etagType;
            }
        }

        throw new IllegalArgumentException("Unknown Etag Type " + type);
    }

    @Override
    public String toString() {
        return text;
    }
}
