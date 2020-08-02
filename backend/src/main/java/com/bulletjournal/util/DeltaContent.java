package com.bulletjournal.util;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;
import com.google.gson.annotations.SerializedName;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class DeltaContent {

    public static final String DELTA = "delta";
    public static final String MDELTA = "mdelta";
    public static final String HTML_TAG = "###html###";
    private static final Gson GSON = new GsonBuilder().disableHtmlEscaping().create();

    @SerializedName(DELTA)
    private Map deltaMap;

    @SerializedName(MDELTA)
    private List mdeltaList;

    @SerializedName(value = HTML_TAG)
    private String html;

    private List<String> mdiff;
    private List<String> diff;

    public DeltaContent(String text) {
        LinkedHashMap<String, Object> map = GSON.fromJson(text, LinkedHashMap.class);
        deltaMap = (Map) map.get(DELTA);
        mdeltaList = (List) map.get(MDELTA);
        this.html = map.get(HTML_TAG) == null ? null : map.get(HTML_TAG).toString();
    }

    public boolean hasDeltaMap() {
        return this.deltaMap != null;
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public boolean hasMdeltaList() {
        return this.mdeltaList != null;
    }

    public Map getDeltaMap() {
        return deltaMap;
    }

    public void setDeltaMap(Map deltaMap) {
        this.deltaMap = deltaMap;
    }

    public List getMdeltaList() {
        return mdeltaList;
    }

    public void setMdeltaList(List mdeltaList) {
        this.mdeltaList = mdeltaList;
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

    public String toJSON() {
        return GSON.toJson(this);
    }
}
