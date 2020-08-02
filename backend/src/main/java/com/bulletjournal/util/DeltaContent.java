package com.bulletjournal.util;

import com.google.gson.Gson;

import javax.validation.constraints.NotNull;
import java.util.LinkedHashMap;
import java.util.List;

public class DeltaContent {

    public static final String HTML_TAG = "###html###";
    private static final Gson GSON = new Gson();

    @NotNull
    private String delta;
    @NotNull
    private String mdelta;

    private String html;
    private List<String> mdiff;
    private List<String> diff;

    public DeltaContent(String text) {
        LinkedHashMap<String, Object> deltaMap = GSON.fromJson(text, LinkedHashMap.class);
        this.delta = deltaMap.get("delta").toString();
    }

    public String getDelta() {
        return delta;
    }

    public void setDelta(String delta) {
        this.delta = delta;
    }

    public boolean hasDelta() {
        return this.delta != null;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public String getMdelta() {
        return mdelta;
    }

    public void setMdelta(String mdelta) {
        this.mdelta = mdelta;
    }

    public boolean hasMdelta() {
        return this.mdelta != null;
    }

    public List<String> getMdiff() {
        return mdiff;
    }

    public void setMdiff(List<String> mdiff) {
        this.mdiff = mdiff;
    }

    public List<String> getDiff() {
        return diff;
    }

    public void setDiff(List<String> diff) {
        this.diff = diff;
    }
}
