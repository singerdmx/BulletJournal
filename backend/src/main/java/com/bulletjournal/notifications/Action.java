package com.bulletjournal.notifications;

import com.bulletjournal.exceptions.BadRequestException;

public enum Action {

    ACCEPT("Accept", "accepted"),
    DECLINE("Decline", "declined");

    private final String description;
    private final String pastTenseDescription;

    Action(String description, String pastTenseDescription) {
        this.description = description;
        this.pastTenseDescription = pastTenseDescription;
    }

    public String getDescription() {
        return this.description;
    }

    public String getPastTenseDescription() {
       return this.pastTenseDescription;
    }

    public static Action getAction(String description) {
        switch (description) {
            case "Accept":
                return ACCEPT;
            case "Decline":
                return DECLINE;
            default:
                throw new BadRequestException("Invalid Action for description: " + description);
        }
    }
}
