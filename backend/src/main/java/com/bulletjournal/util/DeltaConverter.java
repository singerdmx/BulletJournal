package com.bulletjournal.util;

import com.google.gson.Gson;

import java.util.*;

public class DeltaConverter {

    private static Gson gson = new Gson();

    public static String mDeltaToDelta(final String mDelta) {
        List<Map<String, Object>> mDeltaList = gson.fromJson(mDelta, List.class);
        List<LinkedHashMap<String, Object>> deltaList = new ArrayList<>();
        for (Map<String, Object> eDelta : mDeltaList) {
            LinkedHashMap<String, Object> clonedMap = new LinkedHashMap<>();
            // each attributes and insert
            for (Map.Entry<String, Object> e : eDelta.entrySet()) {
                if (Objects.equals(e.getKey(), "attributes")) {
                    Map<String, String> formatMap = (Map<String, String>) e.getValue();
                    LinkedHashMap clonedAttri = new LinkedHashMap();

                    if (Objects.nonNull(formatMap.get("b"))) {
                        Boolean val = Objects.nonNull(formatMap.get("b")) ? true : false;
                        clonedAttri.put("bold", val);
                    }

                    if (Objects.nonNull(formatMap.get("i"))) {
                        Boolean val = Objects.nonNull(formatMap.get("i")) ? true : false;
                        clonedAttri.put("italic", val);
                    }

                    clonedMap.put("attributes", clonedAttri);
                } else {
                    clonedMap.put(e.getKey(), e.getValue());
                }

            }
            deltaList.add(clonedMap);
        }

        LinkedHashMap opsMap = new LinkedHashMap();
        opsMap.put("ops", deltaList);
        LinkedHashMap deltaMap = new LinkedHashMap();
        deltaMap.put("delta", opsMap);

        return gson.toJson(deltaMap);
    }

    public static String deltaTomDelta(final String delta) {

        LinkedHashMap<String, Object> deltaMap = gson.fromJson(delta, LinkedHashMap.class);
        Map<String, Object> opsMap = (Map) deltaMap.get("delta");
        List<LinkedHashMap> opsList = (ArrayList) (opsMap.get("ops"));
        List<LinkedHashMap> mDeltaList = new ArrayList<>();

        for (Map<String, Object> innerDeltaMap : opsList) {
            LinkedHashMap clonedMap = new LinkedHashMap();
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

                    // convert embed

                    clonedMap.put("attributes", clonedAttri);

                } else {
                    clonedMap.put(e.getKey(), e.getValue());
                }
            }

            mDeltaList.add(clonedMap);

        }
        return gson.toJson(mDeltaList);
    }
}

