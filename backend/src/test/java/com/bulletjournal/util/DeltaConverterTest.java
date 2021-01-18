package com.bulletjournal.util;

import com.google.gson.Gson;
import org.junit.Assert;
import org.junit.Test;

import java.util.LinkedHashMap;

public class DeltaConverterTest {
    private static final Gson GSON = new Gson();

    @Test
    public void testEmoji() {
        String webInsert = "{\"emoji\":\"100\"}";
        String mobileExpected = "{\"insert\":\"\uD83D\uDCAF\"}";
        LinkedHashMap emojiMap = GSON.fromJson(webInsert, LinkedHashMap.class);
        String res = GSON.toJson(DeltaConverter.WebToMobile.webToMobileEmoji(emojiMap));
        Assert.assertEquals(mobileExpected, res);
    }

    @Test
    public void testEmojiProvider() {
        Integer unicode = EmojiRuleProvider.NAME_TO_IDS.get("100");
        Assert.assertEquals(128175, (int) unicode);

        String mobileExpected = DeltaConverter.EmojiConverter.nameToSurrogatePair("100").get();
        int codePoint = mobileExpected.codePointAt(0);
        System.out.println(mobileExpected);
        System.out.println(codePoint);
    }

}