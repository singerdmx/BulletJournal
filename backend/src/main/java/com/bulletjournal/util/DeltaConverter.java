package com.bulletjournal.util;

import com.google.gson.Gson;

import java.util.*;

public class DeltaConverter {

    public static String mDeltaToDelta(final String mDelta) {
        Gson gson = new Gson();
        List<Map<String, Object>> mDeltaList = gson.fromJson(mDelta, List.class);
        List<LinkedHashMap<String, Object>> deltaList = new ArrayList<>();
        for (Map<String, Object> eDelta : mDeltaList) {
            LinkedHashMap<String, Object> clonedMap = new LinkedHashMap<>();
            // each attributes and insert
            for (Map.Entry<String, Object> e : eDelta.entrySet()) {
                if (Objects.equals(e.getKey(), "attributes")) {
                    Map<String, String> formatMap =  (Map<String, String>) e.getValue();
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

        Gson gson = new Gson();
        LinkedHashMap<String, Object> deltaMap = gson.fromJson(delta, LinkedHashMap.class);
        Map<String, Object> opsMap = (Map) deltaMap.get("delta");
        List<LinkedHashMap> opsList = (ArrayList) (opsMap.get("ops"));
        List<LinkedHashMap> mDeltaList = new ArrayList<>();

        for (Map<String, Object> innerDeltaMap: opsList) {
            LinkedHashMap clonedMap = new LinkedHashMap();
            for (Map.Entry<String, Object> e: innerDeltaMap.entrySet()) {
                if (Objects.equals(e.getKey(), "attributes")) {
                    Map<String, String> formatMap =  (Map<String, String>) e.getValue();
                    LinkedHashMap clonedAttri = new LinkedHashMap();

                    if (Objects.nonNull(formatMap.get("bold"))) {
                        Boolean val = Objects.nonNull(formatMap.get("bold")) ? true : false;
                        clonedAttri.put("b", val);
                    }

                    if (Objects.nonNull(formatMap.get("italic"))) {
                        Boolean val = Objects.nonNull(formatMap.get("italic")) ? true : false;
                        clonedAttri.put("i", val);
                    }

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

