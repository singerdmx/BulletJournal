package com.bulletjournal.authz;

public enum Role {
    BASIC(0), MEMBER(3), REGULAR(4), MODERATOR(9), ADMIN(10);

    private final int value;

    Role(int value) {
        this.value = value;
    }

    public static Role getType(int type) {
        switch (type) {
            case 0:
                return BASIC;
            case 3:
                return MEMBER;
            case 4:
                return REGULAR;
            case 9:
                return MODERATOR;
            case 10:
                return ADMIN;
            default:
                throw new IllegalArgumentException();
        }
    }

    public int getValue() {
        return value;
    }

}
