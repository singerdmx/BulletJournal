package com.bulletjournal.util;

import com.google.common.io.Resources;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public final class EmojiRuleProvider {
    private static final Logger LOGGER = LoggerFactory.getLogger(EmojiRuleProvider.class);
    private static final Gson GSON = new Gson();
    private static final String EMOJI_FILE = "lib/emoji.json";

    public static final Map<String, Integer> NAME_TO_IDS = new HashMap<>();

    static {
        try {
            URL url = Resources.getResource(EMOJI_FILE);
            String text = Resources.toString(url, StandardCharsets.UTF_8);
            List emojiList = GSON.fromJson(text, ArrayList.class);
            for (Object o : emojiList) {
                if (o instanceof Map) {
                    Map map = (Map) o;
                    String key = (String) (map.get("name"));
                    Integer val;
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
            throw new RuntimeException(ex);
        }
    }

}
