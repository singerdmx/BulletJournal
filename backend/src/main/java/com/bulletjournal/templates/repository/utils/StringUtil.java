package com.bulletjournal.templates.repository.utils;

import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

public class StringUtil {
    public static String toArrayString(JsonObject json, String key) {
        JsonArray jsonArray = json.get(key).getAsJsonArray();
        StringBuilder sb = new StringBuilder();
        jsonArray.forEach((elem) -> sb.append(elem.getAsString()).append(", "));
        sb.setLength(sb.length() - 2);
        return sb.toString();
    }

}
