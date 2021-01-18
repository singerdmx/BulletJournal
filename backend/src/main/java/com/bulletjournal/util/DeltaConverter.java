package com.bulletjournal.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.*;

public class DeltaConverter {
    private static final Logger LOGGER = LoggerFactory.getLogger(DeltaConverter.class);

    static class WebToMobile {

        static LinkedHashMap webToMobileEmoji(Map insertMap) {
            LinkedHashMap mobileElement = new LinkedHashMap();
            String val = (String) insertMap.get("emoji");
            LOGGER.info(" webToMobileEmoji val=" + val);
            mobileElement.put("insert", EmojiConverter.nameToSurrogatePair(val).get());
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

