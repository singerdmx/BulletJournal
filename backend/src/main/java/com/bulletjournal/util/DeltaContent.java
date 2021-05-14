package com.bulletjournal.util;

import com.google.gson.*;
import com.google.gson.annotations.SerializedName;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.lang.reflect.Type;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class DeltaContent {

    public static final String DELTA = "delta";
    public static final String HTML_TAG = "###html###";
    public static final String EMPTY_CONTENT = "{\"delta\":{\"ops\":[{\"insert\":\" \\n\"}]}}";
    private static final Pattern URL_REGEX = Pattern.compile(
            "((https?|ftp|gopher|telnet|file):((//)|(\\\\))+[\\w\\d:#@%/;$()~_?\\+-=\\\\\\.&]*)",
            Pattern.CASE_INSENSITIVE);
    private static final Gson GSON = new GsonBuilder().
            registerTypeAdapter(Double.class, new JsonSerializer<Double>() {
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

    @SerializedName(value = HTML_TAG)
    private String html;

    private List<Object> diff;

    public DeltaContent(String text) {
        LinkedHashMap<String, Object> map = GSON.fromJson(text, LinkedHashMap.class);
        this.deltaMap = adjustDelta((Map) map.get(DELTA));
        this.diff = (List) map.get("diff");
        // this.html = map.get(HTML_TAG) == null ? null : map.get(HTML_TAG).toString();
    }

    private Map adjustDelta(final Map<String, Object> deltaMap) {
        if (deltaMap == null) {
            return null;
        }
        List<Map<String, Object>> deltaList = new ArrayList<>();
        List<LinkedHashMap> opsList = (ArrayList) (deltaMap.get("ops"));
        for (Map<String, Object> innerDeltaMap : opsList) {
            if (innerDeltaMap.containsKey("insert")) {
                Object insertContent = innerDeltaMap.get("insert");
                if (insertContent instanceof Map) {
                    Map insertMap = (Map) insertContent;
                    if (insertMap.containsKey("emoji")) {
                        deltaList.add(DeltaConverter.WebToMobile.webToMobileEmoji(insertMap));
                        continue;
                    }
                } else if (insertContent instanceof String) {
                    String insertString = (String) insertContent;
                    Object attributes = innerDeltaMap.get("attributes");
                    Matcher matcher = URL_REGEX.matcher(insertString);
                    Map attributesMap = new LinkedHashMap();
                    if (attributes != null && attributes instanceof Map) {
                        attributesMap = (Map) attributes;
                    }
                    if (matcher.find() && !attributesMap.containsKey("link")) {
                        int beg = 0;
                        do {
                            int urlStart = matcher.start(0);
                            int urlEnd = matcher.end(0);
                            if (beg < urlStart) {
                                addToList(deltaList, innerDeltaMap, null,
                                        attributesMap, insertString.substring(beg, urlStart));
                            }
                            String link = insertString.substring(urlStart, urlEnd);
                            addToList(deltaList, innerDeltaMap, link, attributesMap, link);
                            beg = urlEnd;
                        } while (matcher.find());
                        if (beg < insertString.length()) {
                            addToList(deltaList, innerDeltaMap, null,
                                    attributesMap, insertString.substring(beg));
                        }
                        continue;
                    }
                }
            }
            deltaList.add(innerDeltaMap);
        }

        LinkedHashMap opsMap = new LinkedHashMap();
        opsMap.put("ops", deltaList);
        return opsMap;
    }

    private void addToList(
            List<Map<String, Object>> deltaList,
            Map<String, Object> innerDeltaMap,
            String link,
            Map attributesMap,
            String substring) {
        if (link == null) {
            attributesMap.remove("link");
        } else {
            attributesMap.put("link", link);
        }
        if (attributesMap.isEmpty()) {
            innerDeltaMap.remove("attributes");
        } else {
            innerDeltaMap.put("attributes", new LinkedHashMap<>(attributesMap));
        }
        innerDeltaMap.put("insert", substring);
        deltaList.add(new LinkedHashMap<>(innerDeltaMap));
    }

    public String getHtml() {
        return html;
    }

    public void setHtml(String html) {
        this.html = html;
    }

    public boolean hasDeltaMap() {
        return this.deltaMap != null;
    }

    public Map getDeltaMap() {
        return this.deltaMap;
    }

    public String getDeltaOpsString() {
        List<LinkedHashMap> opsList = (ArrayList) (getDeltaMap().get("ops"));
        return GSON.toJson(opsList);
    }

    public void setDeltaMap(Map deltaMap) {
        this.deltaMap = deltaMap;
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
