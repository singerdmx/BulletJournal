package com.bulletjournal.messaging.mailjet;

import com.google.common.base.Preconditions;
import org.apache.commons.lang3.tuple.Pair;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

public class MailjetEmailParams {

    private String subject;

    private String text;

    // left: name, right: email
    private List<Pair<String, String>> receivers;

    public MailjetEmailParams(
        @NotEmpty List<Pair<String, String>> receivers,
        @NotNull String subject,
        @NotNull String text
    ) {
        this.receivers = Preconditions.checkNotNull(receivers);
        Preconditions.checkArgument(!receivers.isEmpty());
        this.subject = Preconditions.checkNotNull(subject);
        this.text = Preconditions.checkNotNull(text);
    }

    public List<Pair<String, String>> getReceivers() {
        return receivers;
    }

    public void setReceivers(List<Pair<String, String>> receivers) {
        this.receivers = receivers;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
