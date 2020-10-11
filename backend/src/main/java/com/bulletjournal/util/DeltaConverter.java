package com.bulletjournal.util;

import com.bulletjournal.controller.models.UpdateContentParams;
import com.bulletjournal.exceptions.BadRequestException;
import com.google.common.annotations.VisibleForTesting;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class DeltaConverter {
    // https://github.com/memspace/zefyr/blob/master/packages/notus/lib/src/document/leaf.dart
    public static String kPlainTextPlaceholder = new String(Character.toChars(0x200b));
    private static final Logger LOGGER = LoggerFactory.getLogger(DeltaConverter.class);
    private static final Gson GSON = new Gson();

    public static String supplementContentText(String text, boolean invalidateBoth) {
        // from web: {delta: YYYYY2, ###html###:ZZZZZZ2}
        // from mobile: {mdelta:XXXXXX }
        DeltaContent deltaContent = new DeltaContent(text);

        if (invalidateBoth && deltaContent.hasDeltaMap() && deltaContent.hasMdeltaList()) {
            throw new BadRequestException("Cannot have both delta and mdelta");
        }
        if (deltaContent.hasDeltaMap()) {
            deltaContent.setMdeltaList(deltaTomDelta(deltaContent.getDeltaMap()));
        } else if (deltaContent.hasMdeltaList()) {
            deltaContent.setDeltaMap(mDeltaToDelta(deltaContent.getMdeltaList()));
        } else {
            throw new BadRequestException("None of delta and mdelta exists");
        }

        return deltaContent.toJSON();
    }

    public static String supplementContentText(String text) {
        return supplementContentText(text, true);
    }

    public static String mergeContentText(String webText, String mobileText) {
        LinkedHashMap<String, Object> webTextMap = GSON.fromJson(webText, LinkedHashMap.class);
        LinkedHashMap<String, Object> mobileTextMap = GSON.fromJson(mobileText, LinkedHashMap.class);
        webTextMap.put("mdelta", mobileTextMap.get("mdelta"));
        return GSON.toJson(webTextMap);
    }

    public static UpdateContentParams strToUpdateContentParams(String text) {
        return GSON.fromJson(text, UpdateContentParams.class);
    }

    public static String generateDeltaContent(String contentStr) {
        String content = "{\"delta\":{\"ops\":[{\"insert\":\"TEMPLATE\\n\"}]},\"###html###\":\"<p>TEMPLATE</p><p><br></p>\"}";
        return content.replace("TEMPLATE", contentStr);
    }

    @VisibleForTesting
    public static Map mdiffToDiff(final List<Map<String, Object>> mdiffList) {
        return mDeltaToDelta(mdiffList);
    }

    @VisibleForTesting
    public static List<LinkedHashMap> diffToMdiff(final Map diffMap) {
        return deltaTomDelta(diffMap);
    }

    @VisibleForTesting
    protected static String mDeltaToDeltaStr(final String mDelta) {
        List<Map<String, Object>> mDeltaList = GSON.fromJson(mDelta, List.class);
        LinkedHashMap opsMap = mDeltaToDelta(mDeltaList);
        LinkedHashMap deltaMap = new LinkedHashMap();
        deltaMap.put("delta", opsMap);
        return GSON.toJson(deltaMap);
    }

    protected static LinkedHashMap mDeltaToDelta(final List<Map<String, Object>> mDeltaList) {
        List<LinkedHashMap<String, Object>> deltaList = new ArrayList<>();
        for (Map<String, Object> eDelta : mDeltaList) {
            LinkedHashMap<String, Object> clonedMap = new LinkedHashMap<>();
            if (eDelta.containsKey("attributes") && ((Map) eDelta.get("attributes")).containsKey("embed")) {
                LinkedHashMap webElement = mobileToWebImage(eDelta);
                deltaList.add(webElement);
                continue;
            }
            // each attributes and insert
            for (Map.Entry<String, Object> e : eDelta.entrySet()) {
                if (Objects.equals(e.getKey(), "attributes")) {
                    Map<String, Object> formatMap = (Map<String, Object>) e.getValue();
                    LinkedHashMap clonedAttri = new LinkedHashMap();
                    // bold
                    if (Objects.nonNull(formatMap.get("b"))) {
                        Boolean val = (Boolean) formatMap.get("b");
                        clonedAttri.put("bold", val);
                    }
                    //italic
                    if (Objects.nonNull(formatMap.get("i"))) {
                        Boolean val = (Boolean) formatMap.get("i");
                        clonedAttri.put("italic", val);
                    }

                    //link
                    if (Objects.nonNull(formatMap.get("a"))) {
                        String val = (String) formatMap.get("a");
                        clonedAttri.put("link", val);
                    }
                    //heading
                    if (Objects.nonNull(formatMap.get("heading"))) {
                        Double val = (Double) formatMap.get("heading");
                        Integer intVal = val.intValue();
                        clonedAttri.put("header", intVal);
                    }

                    //block
                    //list
                    if (Objects.nonNull(formatMap.get("block"))) {
                        String val = (String) formatMap.get("block");
                        // order list
                        if (val.equals("ol")) {
                            clonedAttri.put("list", "ordered");
                        }
                        // bullet list
                        if (val.equals("ul")) {
                            clonedAttri.put("list", "bullet");
                        }
                        //code
                        if (val.equals("code")) {
                            clonedAttri.put("code-block", true);
                        }
                        //quote
                        if (val.equals("quote")) {
                            clonedAttri.put("blockquote", true);
                        }
                    }

                    // convert embed : imagine


                    clonedMap.put("attributes", clonedAttri);
                } else {
                    clonedMap.put(e.getKey(), toIntegerIfDouble(e.getValue()));
                }

            }
            deltaList.add(clonedMap);
        }

        LinkedHashMap opsMap = new LinkedHashMap();
        opsMap.put("ops", deltaList);


        return opsMap;
    }

    private static LinkedHashMap mobileToWebImage(Map<String, Object> eDelta) {
        String imageVal = (String) ((Map) ((Map) eDelta.get("attributes")).get("embed")).get("source");
        LinkedHashMap insertMap = new LinkedHashMap();
        insertMap.put("image", imageVal);
        LinkedHashMap webElement = new LinkedHashMap();
        webElement.put("insert", insertMap);
        return webElement;
    }

    @VisibleForTesting
    protected static String deltaTomDeltaStr(final String delta) {
        LinkedHashMap<String, Object> map = GSON.fromJson(delta, LinkedHashMap.class);
        Map<String, Object> deltaMap = (Map) map.get("delta");
        return GSON.toJson(deltaTomDelta(deltaMap));
    }

    protected static List<LinkedHashMap> deltaTomDelta(final Map<String, Object> deltaMap) {

        List<LinkedHashMap> opsList = (ArrayList) (deltaMap.get("ops"));
        List<LinkedHashMap> mDeltaList = new ArrayList<>();

        for (Map<String, Object> innerDeltaMap : opsList) {
            LinkedHashMap clonedMap = new LinkedHashMap();
            if (innerDeltaMap.containsKey("insert") && (innerDeltaMap.get("insert")) instanceof Map) {
                LinkedHashMap mobileElement = WebToMobile.webToMobileInsertMap(innerDeltaMap);
                mDeltaList.add(mobileElement);
                continue;
            }

            for (Map.Entry<String, Object> e : innerDeltaMap.entrySet()) {
                if (Objects.equals(e.getKey(), "attributes")) {
                    Map<String, Object> formatMap = (Map<String, Object>) e.getValue();
                    LinkedHashMap clonedAttri = new LinkedHashMap();

                    // bold
                    if (Objects.nonNull(formatMap.get("bold"))) {
                        Boolean val = (Boolean) formatMap.get("bold");
                        clonedAttri.put("b", val);
                    }
                    //italic
                    if (Objects.nonNull(formatMap.get("italic"))) {
                        Boolean val = (Boolean) formatMap.get("italic");
                        clonedAttri.put("i", val);
                    }
                    //link
                    if (Objects.nonNull(formatMap.get("link"))) {
                        String val = (String) formatMap.get("link");
                        clonedAttri.put("a", val);
                    }
                    //heading
                    if (Objects.nonNull(formatMap.get("header"))) {
                        Double val = (Double) formatMap.get("header");
                        Integer intVal = val.intValue();
                        clonedAttri.put("heading", intVal);
                    }
                    //block
                    //list
                    if (Objects.nonNull(formatMap.get("list"))) {
                        String val = (String) formatMap.get("list");
                        // order list
                        if (val.equals("ordered")) {
                            clonedAttri.put("block", "ol");
                        }
                        // bullet list
                        if (val.equals("bullet")) {
                            clonedAttri.put("block", "ul");
                        }
                    }
                    //code
                    if (Objects.nonNull(formatMap.get("code-block"))) {
                        Boolean val = (Boolean) formatMap.get("code-block");
                        if (val) {
                            clonedAttri.put("block", "code");
                        }
                    }
                    //quote
                    if (Objects.nonNull(formatMap.get("blockquote"))) {
                        Boolean val = (Boolean) formatMap.get("blockquote");
                        clonedAttri.put("block", "quote");
                    }

                    // convert embed : imagine

                    clonedMap.put("attributes", clonedAttri);

                } else {
                    clonedMap.put(e.getKey(), toIntegerIfDouble(e.getValue()));
                }
            }

            mDeltaList.add(clonedMap);
        }
        return mDeltaList;
    }

    private static Object toIntegerIfDouble(final Object o) {
        return o instanceof Double ? ((Double) o).intValue() : o;
    }

    static class WebToMobile {
        static LinkedHashMap webToMobileInsertMap(Map map) {
            Map insertMap = (Map) map.get("insert");

            if (insertMap.containsKey("emoji")) {
                return webToMobileEmoji(insertMap);
            }

            if (insertMap.containsKey("image")) {
                return webToMobileImage(insertMap);
            }

            return new LinkedHashMap();
        }

        static LinkedHashMap webToMobileEmoji(Map insertMap) {
            LinkedHashMap mobileElement = new LinkedHashMap();
            String val = (String) insertMap.get("emoji");
            LOGGER.info(" webToMobileEmoji val=" + val);
            mobileElement.put("insert", EmojiConverter.nameToSurrogatePair(val).get());
            return mobileElement;
        }

        static LinkedHashMap webToMobileImage(Map insertVal) {
            LinkedHashMap mobileElement = new LinkedHashMap();

            String imageVal = (String) insertVal.get("image");
            LinkedHashMap mobileElementAttributes = new LinkedHashMap();
            LinkedHashMap mobileElementAttributesEmbed = new LinkedHashMap();
            mobileElementAttributesEmbed.put("type", "image");
            mobileElementAttributesEmbed.put("source", imageVal);
            mobileElementAttributes.put("embed", mobileElementAttributesEmbed);

            mobileElement.put("insert", kPlainTextPlaceholder);
            mobileElement.put("attributes", mobileElementAttributes);
            return mobileElement;
        }
    }

    static class EmojiConverter {
        public static Optional<String> nameToSurrogatePair(final String name) {

            String trimName = name.replace(":", "").trim();
            try {
                if (EmojiRuleProvider.NAME_TO_IDS.containsKey(trimName)) {
                    int codePoint = EmojiRuleProvider.NAME_TO_IDS.get(trimName);
                    return Optional.of(new String(Character.toChars(codePoint)));
                }
            } catch (Exception e) {
                LOGGER.error("Unable convert emoji name to surrogate pair", e);
            }

            return Optional.empty();
        }
    }
}

