package com.bulletjournal.messaging.firebase;


import com.google.common.base.Preconditions;
import org.apache.commons.lang3.tuple.Pair;

import java.util.HashMap;
import java.util.Map;

public class FcmMessageParams {

    private String token;
    private Map<String, String> data;
    private String notificationTitle;
    private String notificationBody;

    public FcmMessageParams(String token, String... kv) {
        Preconditions.checkArgument((kv.length & 1) == 0,
            "Argument kv must be Key-Value pairs");
        this.token = token;
        this.data = new HashMap<>();
        for (int i = 0; i < kv.length; i += 2) {
            data.put(kv[i], kv[i + 1]);
        }
    }

    public FcmMessageParams(
        String token,
        Pair<String, String> notification,
        String... kv
    ) {
        this(token, kv);
        this.notificationTitle = notification.getLeft();
        this.notificationBody = notification.getRight();
    }

    public String getToken() {
        return token;
    }

    public String getNotificationTitle() {
        return notificationTitle;
    }

    public void setNotificationTitle(String notificationTitle) {
        this.notificationTitle = notificationTitle;
    }

    public String getNotificationBody() {
        return notificationBody;
    }

    public void setNotificationBody(String notificationBody) {
        this.notificationBody = notificationBody;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "FcmMessageParams{" +
            "token='" + token + '\'' +
            ", data=" + data +
            '}';
    }
}
