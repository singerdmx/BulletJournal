package com.bulletjournal.controller.models;

public class ContentDiff {

    private String diff;

    //  whole content including html, e.g. {“delta”:YYYYY,”###html###”:ZZZZZZ}
    private String text;

    public String getDiff() {
        return diff;
    }

    public void setDiff(String diff) {
        this.diff = diff;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }
}
