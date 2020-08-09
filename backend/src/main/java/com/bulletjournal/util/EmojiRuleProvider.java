package com.bulletjournal.util;

import com.google.gson.Gson;
import com.google.gson.stream.JsonReader;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class EmojiRuleProvider {
    private static final Logger LOGGER = LoggerFactory.getLogger(EmojiRuleProvider.class);
    private static final Gson GSON = new Gson();

    public static final Map<String, Integer> NAME_TO_IDS = new HashMap<>();

    static {
        String filename = System.getProperty("user.dir")  + "/src/main/resources/lib/emoji.json";
        try {
            System.out.println(filename);
            JsonReader reader = new JsonReader(new FileReader(filename));
            List emojiList = GSON.fromJson(reader, ArrayList.class);
            for (Object o : emojiList) {
                if (o instanceof Map) {
                    Map map = (Map) o;
                    String key = (String) (map.get("name"));
                    Integer val = null;
                    try {
                        val = Integer.parseInt((String) map.get("unicode"), 16);
                    } catch (NumberFormatException e) {
                        continue; // skip e.g. 0023-20e3
                    }

                    NAME_TO_IDS.put(key, val);
                }
            }
        } catch (Exception ex) {
            LOGGER.error("Unable to load emoji rules", ex);
        }
    }

}
