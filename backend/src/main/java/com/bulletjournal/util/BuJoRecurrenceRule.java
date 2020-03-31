package com.bulletjournal.util;

import org.dmfs.rfc5545.DateTime;
import org.dmfs.rfc5545.recur.InvalidRecurrenceRuleException;
import org.dmfs.rfc5545.recur.RecurrenceRule;
import org.dmfs.rfc5545.recur.RecurrenceRuleIterator;

public class BuJoRecurrenceRule {
    private static final String DATETIME_START_KEY = "DTSTART:";
    private static final String DATETIME_END_KEY = "UTIL=";
    private static final String RECURRENCE_RULE_KEY = "RRULE:";
    private static final int RFC5545_DATETIME_LENGTH = 15;

    private String recurInput;
    private DateTime start;
    private DateTime util;

    private boolean hasEnd;

    private RecurrenceRule rrule;

    public BuJoRecurrenceRule(String recurInput, String timezone) throws InvalidRecurrenceRuleException {
        this.recurInput = recurInput;
        if (!parseDTStart(timezone))
            throw new IllegalStateException("RRule DTStart parsing error");

        this.hasEnd = parseDTUntil();
        this.rrule = new RecurrenceRule(parseRRuel());

        if (this.hasEnd) this.rrule.setUntil(this.util);
    }

    public static BuJoRecurrenceRule create(String recurInput) throws InvalidRecurrenceRuleException {
        return new BuJoRecurrenceRule(recurInput, null);
    }

    public RecurrenceRuleIterator getIterator() {
        return this.rrule.iterator(start);
    }

    public RecurrenceRule getRrule() {
        return rrule;
    }

    private String parseRRuel() {
        int idxOfRRuleStart = this.recurInput.indexOf(RECURRENCE_RULE_KEY);
        int idxOfRRuleEnd = this.recurInput.length();
        if (this.hasEnd) {
            idxOfRRuleEnd = this.recurInput.indexOf(DATETIME_END_KEY);
        }
        return this.recurInput.substring(idxOfRRuleStart + RECURRENCE_RULE_KEY.length(), idxOfRRuleEnd);
    }

    private String getRFC5545DateTime(int startIdx, String key) {
        int idxOfDateTimeStart = startIdx + key.length();
        int idxOfDateTimeEnd = idxOfDateTimeStart + RFC5545_DATETIME_LENGTH;
        return recurInput.substring(idxOfDateTimeStart, idxOfDateTimeEnd);
    }

    private boolean parseDTStart(String timezone) {
        int indexOfDTStart = recurInput.indexOf(DATETIME_START_KEY);
        if (indexOfDTStart == -1) {
            return false;
        }
        String rfc5545DateTime = getRFC5545DateTime(indexOfDTStart, DATETIME_START_KEY);
        this.start = timezone == null ? DateTime.parse(rfc5545DateTime) : DateTime.parse(timezone, rfc5545DateTime);
        return true;
    }

    private boolean parseDTUntil() {
        int indexOfDTUntil = recurInput.indexOf(DATETIME_END_KEY);
        if (indexOfDTUntil == -1)
            return false;

        String rfc5545DateTime = getRFC5545DateTime(indexOfDTUntil + DATETIME_END_KEY.length(), DATETIME_END_KEY);
        this.util = DateTime.parse(rfc5545DateTime);
        return true;
    }

    public DateTime getStart() {
        return start;
    }

    public void setStart(DateTime start) {
        this.start = start;
    }

    public DateTime getUtil() {
        return util;
    }

    public void setUtil(DateTime util) {
        this.util = util;
    }
}
