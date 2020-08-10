package com.bulletjournal.util;

import com.google.gson.Gson;
import com.google.gson.JsonParser;
import org.junit.Assert;
import org.junit.Test;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static com.bulletjournal.util.DeltaConverter.supplementContentText;

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
    public void testConvertMobileToWebImage() {
        String mobile = "[{\"insert\":\"\",\"attributes\":{\"embed\":{\"type\":\"image\",\"source\":\"https://s3.us-west-1.amazonaws.com/bulletjournals/202008060434000-4821de84-23b3-47f7-aac6-eed189fa9ac7-WeChat_Image_20191116032740.jpg\"}}},{\"insert\":\"\\n\"}]";
        String webExpected = "{\"delta\":{\"ops\":[{\"insert\":{\"image\":\"https://s3.us-west-1.amazonaws.com/bulletjournals/202008060434000-4821de84-23b3-47f7-aac6-eed189fa9ac7-WeChat_Image_20191116032740.jpg\"}},{\"insert\":\"\\n\"}]}}";

        Assert.assertEquals(webExpected, DeltaConverter.mDeltaToDeltaStr(mobile));
    }

    @Test
    public void testConvertWebToMobileImage() {
        String web = "{\"delta\":{\"ops\":[{\"insert\":{\"image\":\"https://s3.us-west-1.amazonaws.com/bulletjournals/202008060434000-4821de84-23b3-47f7-aac6-eed189fa9ac7-WeChat_Image_20191116032740.jpg\"}},{\"insert\":\"\\n\"}]}}";
        String mobileExpected = "[{\"insert\":\"" + DeltaConverter.kPlainTextPlaceholder +
                "\",\"attributes\":{\"embed\":{\"type\":\"image\",\"source\":\"https://s3.us-west-1.amazonaws.com/bulletjournals/202008060434000-4821de84-23b3-47f7-aac6-eed189fa9ac7-WeChat_Image_20191116032740.jpg\"}}},{\"insert\":\"\\n\"}]";
        Map<String, Object> webMap = GSON.fromJson(web, Map.class);
        List mobile = DeltaConverter.deltaTomDelta((Map) webMap.get("delta"));
        Assert.assertEquals(mobileExpected, GSON.toJson(mobile));

        web = "{\"delta\":{\"ops\":[{\"insert\":{\"emoji\":\"joy\"}},{\"insert\":\"\\n\"}]}}";
        mobileExpected = "[{\"insert\":\"\uD83D\uDE02\"},{\"insert\":\"\\n\"}]";
        webMap = GSON.fromJson(web, Map.class);
        mobile = DeltaConverter.deltaTomDelta((Map) webMap.get("delta"));
        Assert.assertEquals(mobileExpected, GSON.toJson(mobile));

    }

    @Test
    public void testUpdateParams() {
        String testUpdateContent3 = "{\"text\":\"{\\\"delta\\\":{\\\"ops\\\":[{\\\"insert\\\":\\\"Test Content 2\\\\n\\\"}]},\\\"###html###\\\":\\\"<p>Test Content 2</p>\\\"}\",\"diff\":\"{\\\"ops\\\":[{\\\"retain\\\":13},{\\\"insert\\\":\\\"2\\\"},{\\\"delete\\\":1}]}\"}";
        LinkedHashMap e = GSON.fromJson(testUpdateContent3, LinkedHashMap.class);

        System.out.println(testUpdateContent3);
    }

    @Test
    public void testMidffToDiff() {
        String input = "[{\"retain\":5.0,\"attributes\":{\"b\":true}}]";
        String expected = "{\"ops\":[{\"retain\":5,\"attributes\":{\"bold\":true}}]}";
        List mdiffList = GSON.fromJson(input, List.class);
        Map res = DeltaConverter.mdiffToDiff(mdiffList);
        Assert.assertEquals(expected, GSON.toJson(res));
    }

    @Test
    public void testDiffToMdiff() {
        String input = "{\"ops\":[{\"retain\":4},{\"attributes\":{\"bold\":true},\"insert\":\"hij\"},{\"insert\":\"\\n\"}]}";
        String expected = "[{\"retain\":4},{\"attributes\":{\"b\":true},\"insert\":\"hij\"},{\"insert\":\"\\n\"}]";
        Map diffMap = GSON.fromJson(input, LinkedHashMap.class);
        List res = DeltaConverter.diffToMdiff(diffMap);
        Assert.assertEquals(expected, GSON.toJson(res));
    }

    @Test
    public void testDeltaContent() {
        DeltaContent deltaContent = new DeltaContent(
                "{\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]},\"###html###\":\"<p>Test1</p><p>Test2</p><p><br></p>\"}");
        deltaContent.getDeltaMap();
    }

    /**
     * Tests {@link DeltaConverter#supplementContentText(String)}
     */
    @Test
    public void testSupplementContentText() {
        String delta = "{\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]},\"###html###\":\"<p>Test1</p><p>Test2</p><p><br></p>\"}";
        String deltaToMdeltaExpected = "{\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]},\"mdelta\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}],\"###html###\":\"<p>Test1</p><p>Test2</p><p><br></p>\"}";
        String deltaToMdeltaRes = supplementContentText(delta);
        Assert.assertEquals(deltaToMdeltaExpected, deltaToMdeltaRes);

        String mdelta = "{\"mdelta\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]}";
        String mdeltaToDeltaExpected = "{\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]},\"mdelta\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]}";
        String mdeltaToDeltaRes = supplementContentText(mdelta);
        Assert.assertEquals(mdeltaToDeltaExpected, mdeltaToDeltaRes);
    }

    @Test
    public void converter() {
        String mDeltaBold = "[{\"insert\":\"test Bold\",\"attributes\":{\"b\":true}},{\"insert\":\"\\n\"}]";
        String deltaBold = "{\"delta\":{\"ops\":[{\"attributes\":{\"bold\":true},\"insert\":\"test Bold\"},{\"insert\":\"\\n\"}]}}";

        String mDeltaInsert = "[{\"insert\":\"test Italic\",\"attributes\":{\"i\":true}},{\"insert\":\"\\n\"}]";
        String deltaInsert = "{\"delta\":{\"ops\":[{\"attributes\":{\"italic\":true},\"insert\":\"test Italic\"},{\"insert\":\"\\n\"}]}}";

        String deltaLink = "{\"delta\":{\"ops\":[{\"attributes\":{\"link\":\"Link\"},\"insert\":\"Link\"},{\"insert\":\"\\n\"}]}}";
        String mDeltaLink = "[{\"insert\":\"Link\",\"attributes\":{\"a\":\"Link\"}},{\"insert\":\"\\n\"}]";

        String deltaHeading1 = "{\"delta\":{\"ops\":[{\"insert\":\"heading 1\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"}]}}";
        String mDeltaHeading1 = "[{\"insert\":\"heading 1\"},{\"insert\":\"\\n\",\"attributes\":{\"heading\":1}}]";

        String deltaHeading2 = "{\"delta\":{\"ops\":[{\"insert\":\"heading 2\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"}]}}";
        String mDeltaHeading2 = "[{\"insert\":\"heading 2\"},{\"insert\":\"\\n\",\"attributes\":{\"heading\":2}}]";

        String deltaOrderList = "{\"delta\":{\"ops\":[{\"insert\":\"order list 1\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"order list 2\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"}]}}";
        String mDeltaOrderList = "[{\"insert\":\"order list 1\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"ol\"}},{\"insert\":\"order list 2\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"ol\"}}]";

        String deltaBulletList = "{\"delta\":{\"ops\":[{\"insert\":\"bullet list 1\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"bullet list 2\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"}]}}";
        String mDeltaBulletList = "[{\"insert\":\"bullet list 1\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"ul\"}},{\"insert\":\"bullet list 2\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"ul\"}}]";

        String deltaCodeBlock = "{\"delta\":{\"ops\":[{\"insert\":\"code block\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"}]}}";
        String mDeltaCodeBlock = "[{\"insert\":\"code block\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"code\"}}]";

        String deltaQuoteBlock = "{\"delta\":{\"ops\":[{\"insert\":\"quote block\"},{\"attributes\":{\"blockquote\":true},\"insert\":\"\\n\"}]}}";
        String mDeltaQuoteBlock = "[{\"insert\":\"quote block\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"quote\"}}]";


        // test delta -> mdelta
        Assert.assertEquals(JsonParser.parseString(mDeltaBold), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaBold)));
        Assert.assertEquals(JsonParser.parseString(mDeltaInsert), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaInsert)));
        Assert.assertEquals(JsonParser.parseString(mDeltaLink), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaLink)));
        Assert.assertEquals(JsonParser.parseString(mDeltaHeading1), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaHeading1)));
        Assert.assertEquals(JsonParser.parseString(mDeltaHeading2), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaHeading2)));
        Assert.assertEquals(JsonParser.parseString(mDeltaOrderList), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaOrderList)));
        Assert.assertEquals(JsonParser.parseString(mDeltaBulletList), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaBulletList)));
        Assert.assertEquals(JsonParser.parseString(mDeltaCodeBlock), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaCodeBlock)));
        Assert.assertEquals(JsonParser.parseString(mDeltaQuoteBlock), JsonParser.parseString(DeltaConverter.deltaTomDeltaStr(deltaQuoteBlock)));


        // test mdelta -> delta
        Assert.assertEquals(JsonParser.parseString(deltaBold), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaBold)));
        Assert.assertEquals(JsonParser.parseString(deltaInsert), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaInsert)));
        Assert.assertEquals(JsonParser.parseString(deltaLink), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaLink)));
        Assert.assertEquals(JsonParser.parseString(deltaHeading1), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaHeading1)));
        Assert.assertEquals(JsonParser.parseString(deltaHeading2), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaHeading2)));
        Assert.assertEquals(JsonParser.parseString(deltaOrderList), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaOrderList)));
        Assert.assertEquals(JsonParser.parseString(deltaBulletList), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaBulletList)));
        Assert.assertEquals(JsonParser.parseString(deltaCodeBlock), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaCodeBlock)));
        Assert.assertEquals(JsonParser.parseString(deltaQuoteBlock), JsonParser.parseString(DeltaConverter.mDeltaToDeltaStr(mDeltaQuoteBlock)));

    }

}