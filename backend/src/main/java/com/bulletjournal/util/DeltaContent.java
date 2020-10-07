package com.bulletjournal.util;

import com.google.gson.*;
import com.google.gson.annotations.SerializedName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Type;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

public class DeltaContent {

    public static final String DELTA = "delta";
    public static final String MDELTA = "mdelta";
    public static final String HTML_TAG = "###html###";
    public static final String EMPTY_CONTENT = "{\"delta\":{\"ops\":[{\"insert\":\" \\n\"}]}," +
            "\"###html###\":\"<p> </p>\"}";
    private static final Gson GSON = new GsonBuilder().
            registerTypeAdapter(Double.class,  new JsonSerializer<Double>() {
                @Override
                public JsonElement serialize(Double src, Type typeOfSrc, JsonSerializationContext context) {
                    if (src == src.longValue())
                        return new JsonPrimitive(src.longValue());
                    return new JsonPrimitive(src);
                }
            }).disableHtmlEscaping().create();
    private static final Logger LOGGER = LoggerFactory.getLogger(DeltaContent.class);

    @SerializedName(DELTA)
    private Map deltaMap;

    @SerializedName(MDELTA)
    private List mdeltaList;

    @SerializedName(value = HTML_TAG)
    private String html;

    private List<Object> mdiff;
    private List<Object> diff;

    public DeltaContent(String text) {
        // LOGGER.info("DeltaContent {}", text);
        LinkedHashMap<String, Object> map = GSON.fromJson(text, LinkedHashMap.class);
        deltaMap = (Map) map.get(DELTA);
        mdeltaList = (List) map.get(MDELTA);
        diff = (List) map.get("diff");
        mdiff = (List) map.get("mdiff");
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

    public List<Object> getMdiff() {
        return mdiff;
    }

    public List<Object> getMdiffOrDefault(List<Object> defaultValue) {
        return mdiff != null ? mdiff : defaultValue;
    }

    public void setMdiff(List<Object> mdiff) {
        this.mdiff = mdiff;
    }

    public List<Object> getDiff() {
        return diff;
    }
    public List<Object> getDiffOrDefault(List<Object> defaultValue) {
        return diff != null ? diff : defaultValue;
    }

    public void setDiff(List<Object> diff) {
        this.diff = diff;
    }

    public String toJSON() {
        return GSON.toJson(this);
    }
}
