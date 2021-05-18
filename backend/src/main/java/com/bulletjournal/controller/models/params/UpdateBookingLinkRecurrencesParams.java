package com.bulletjournal.controller.models.params;

import com.bulletjournal.controller.models.RecurringSpan;

import java.util.List;

public class UpdateBookingLinkRecurrencesParams {
    private List<RecurringSpan> recurrences;
    private String timezone;

    public UpdateBookingLinkRecurrencesParams() {
    }

    public UpdateBookingLinkRecurrencesParams(List<RecurringSpan> recurrences, String timezone) {
        this.recurrences = recurrences;
        this.timezone = timezone;
    }

    public List<RecurringSpan> getRecurrences() {
        return recurrences;
    }

    public void setRecurrences(List<RecurringSpan> recurrences) {
        this.recurrences = recurrences;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }
}
