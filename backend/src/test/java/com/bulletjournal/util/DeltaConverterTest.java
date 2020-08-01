package com.bulletjournal.util;

import com.google.gson.JsonParser;
import org.junit.Assert;
import org.junit.Test;

public class DeltaConverterTest {

    @Test
    public void converter() {
        String mDeltaBold = "[{\"insert\":\"test Bold\",\"attributes\":{\"b\":true}},{\"insert\":\"\\n\"}]";
        String deltaBold = "{\"delta\":{\"ops\":[{\"attributes\":{\"bold\":true},\"insert\":\"test Bold\"},{\"insert\":\"\\n\"}]}}";

        String mDeltaInsert = "[{\"insert\":\"test Italic\",\"attributes\":{\"i\":true}},{\"insert\":\"\\n\"}]";
        String detlaInsert = "{\"delta\":{\"ops\":[{\"attributes\":{\"italic\":true},\"insert\":\"test Italic\"},{\"insert\":\"\\n\"}]}}";

        String deltaLink = "{\"delta\":{\"ops\":[{\"attributes\":{\"link\":\"Link\"},\"insert\":\"Link\"},{\"insert\":\"\\n\"}]},\"###html###\":\"<p><a href=\\\"Link\\\" rel=\\\"noopener noreferrer\\\" target=\\\"_blank\\\">Link</a></p>\"}";
        String mdeltaLink = "[{\"insert\":\"Link\",\"attributes\":{\"a\":\"Link\"}},{\"insert\":\"\\n\"}]";

        String deltaHeading1 = "{\"delta\":{\"ops\":[{\"insert\":\"heading 1\"},{\"attributes\":{\"header\":1},\"insert\":\"\\n\"}]},\"###html###\":\"<h1>heading 1</h1>\"}";
        String mDltaHeading1 = "[{\"insert\":\"heading 1\"},{\"insert\":\"\\n\",\"attributes\":{\"heading\":1}}]";

        String deltaHeading2 = "{\"delta\":{\"ops\":[{\"insert\":\"heading 2\"},{\"attributes\":{\"header\":2},\"insert\":\"\\n\"}]},\"###html###\":\"<h2>heading 2</h2>\"}";
        String mDeltaHeading2 = "[{\"insert\":\"heading 2\"},{\"insert\":\"\\n\",\"attributes\":{\"heading\":2}}]";

        String deltaOrderList = "{\"delta\":{\"ops\":[{\"insert\":\"order list 1\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"},{\"insert\":\"order list 2\"},{\"attributes\":{\"list\":\"ordered\"},\"insert\":\"\\n\"}]},\"###html###\":\"<ol><li>order list 1</li><li>order list 2</li></ol>\"}";
        String mDetlaOrderList = "[{\"insert\":\"order list 1\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"ol\"}},{\"insert\":\"order list 2\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"ol\"}}]";

        String deltaBulletList = "{\"delta\":{\"ops\":[{\"insert\":\"bullet list 1\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"},{\"insert\":\"bullet list 2\"},{\"attributes\":{\"list\":\"bullet\"},\"insert\":\"\\n\"}]},\"###html###\":\"<ul><li>bullet list 1</li><li>bullet list 2</li></ul>\"}";
        String mDetlaBulletList = "[{\"insert\":\"bullet list 1\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"ul\"}},{\"insert\":\"bullet list 2\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"ul\"}}]";

        String deltaCodeBlock = "{\"delta\":{\"ops\":[{\"insert\":\"code block\"},{\"attributes\":{\"code-block\":true},\"insert\":\"\\n\"}]},\"###html###\":\"<pre class=\\\"ql-syntax\\\" spellcheck=\\\"false\\\">code block\\n</pre>\"}";
        String mDeltaCodeBlock = "[{\"insert\":\"code block\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"code\"}}]";

        String deltaQuoteBlock = "{\"delta\":{\"ops\":[{\"insert\":\"quote block\"},{\"attributes\":{\"blockquote\":true},\"insert\":\"\\n\"}]},\"###html###\":\"<blockquote>quote block</blockquote>\"}";
        String mDeltaQuoteBlock = "[{\"insert\":\"quote block\"},{\"insert\":\"\\n\",\"attributes\":{\"block\":\"quote\"}}]";


        // test delta -> mdelta
        Assert.assertEquals(JsonParser.parseString(mDeltaBold), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaBold)));
        Assert.assertEquals(JsonParser.parseString(mDeltaInsert), JsonParser.parseString(DeltaConverter.deltaTomDelta(detlaInsert)));
        Assert.assertEquals(JsonParser.parseString(mdeltaLink), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaLink)));
        Assert.assertEquals(JsonParser.parseString(mDltaHeading1), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaHeading1)));
        Assert.assertEquals(JsonParser.parseString(mDeltaHeading2), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaHeading2)));
        Assert.assertEquals(JsonParser.parseString(mDetlaOrderList), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaOrderList)));
        Assert.assertEquals(JsonParser.parseString(mDetlaBulletList), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaBulletList)));
        Assert.assertEquals(JsonParser.parseString(mDeltaCodeBlock), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaCodeBlock)));
        Assert.assertEquals(JsonParser.parseString(mDeltaQuoteBlock), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaQuoteBlock)));

    }

}