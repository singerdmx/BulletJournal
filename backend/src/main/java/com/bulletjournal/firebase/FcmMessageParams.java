package com.bulletjournal.firebase;

public class FcmMessageParams {

    private String title;
    private String message;
    private String token;
    private String topic;

    public FcmMessageParams(String title, String message, String token, String topic) {
        this.title = title;
        this.message = message;
        this.token = token;
        this.topic = topic;
    }

    public String getTopic() {
        return topic;
    }

    public void setTopic(String topic) {
        this.topic = topic;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }
}
