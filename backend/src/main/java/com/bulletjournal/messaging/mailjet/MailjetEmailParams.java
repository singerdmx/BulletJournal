package com.bulletjournal.messaging.mailjet;

import com.google.common.base.Preconditions;
import org.apache.commons.lang3.tuple.ImmutablePair;
import org.apache.commons.lang3.tuple.Pair;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;

public class MailjetEmailParams {

    private String subject;

    private String text;

    private MailjetEmailClient.Template template;

    private List<Pair<String, Object>> kv = new ArrayList<>();

    // left: name, right: email
    private List<Pair<String, String>> receivers;

    public MailjetEmailParams(
        @NotEmpty List<Pair<String, String>> receivers,
        @NotNull String subject,
        String text,
        MailjetEmailClient.Template template,
        String...kv
    ) {
        this.receivers = Preconditions.checkNotNull(receivers);
        Preconditions.checkArgument(!receivers.isEmpty());
        this.subject = Preconditions.checkNotNull(subject);
        this.text = text;
        this.template = template;
        for (int i = 0; i < kv.length - 1; i += 2) {
            this.kv.add(new ImmutablePair<>(kv[i], kv[i + 1]));
        }
    }

    public void addKv(String k, Object v) {
        this.kv.add(new ImmutablePair<>(k, v));
    }

    public MailjetEmailClient.Template getTemplate() {
        return template;
    }

    public void setTemplate(MailjetEmailClient.Template template) {
        this.template = template;
    }

    public List<Pair<String, Object>> getKv() {
        return kv;
    }

    public void setKv(List<Pair<String, Object>> kv) {
        this.kv = kv;
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

    @Override
    public String toString() {
        return "MailjetEmailParams{" +
            "subject='" + subject + '\'' +
            ", text='" + text + '\'' +
            ", template=" + template +
            ", kv=" + kv +
            ", receivers=" + receivers +
            '}';
    }
}
