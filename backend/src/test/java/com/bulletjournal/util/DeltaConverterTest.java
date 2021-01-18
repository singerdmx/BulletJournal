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

    @Test
    public void testUpdateParams() {
        String testUpdateContent3 = "{\"text\":\"{\\\"delta\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"Test Content 2\\\\n\\\"}]},\\\"###html###\\\":\\\"<p>Test Content 2</p>\\\"}\",\"diff\":\"{\\\"ops\\\":[{\\\"retain\\\":13},{\\\"insert\\\":\\\"2\\\"},{\\\"delete\\\":1}]}\"}";
        LinkedHashMap e = GSON.fromJson(testUpdateContent3, LinkedHashMap.class);

        System.out.println(testUpdateContent3);
    }

    @Test
    public void testDeltaContent() {
        DeltaContent deltaContent = new DeltaContent(
                "{\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]},\"###html###\":\"<p>Test1</p><p>Test2</p><p><br></p>\"}");
        deltaContent.getDeltaMap();
    }

}