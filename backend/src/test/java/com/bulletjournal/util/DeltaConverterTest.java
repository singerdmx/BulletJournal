package com.bulletjournal.util;

import com.google.gson.JsonParser;
import org.junit.Assert;
import org.junit.Test;

public class DeltaConverterTest {

    @Test
    public void testDeltaContent() {
        DeltaContent deltaContent = new DeltaContent(
                "{\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]},\"###html###\":\"<p>Test1</p><p>Test2</p><p><br></p>\"}");
        deltaContent.getDelta();
    }

    /**
     * Tests {@link DeltaConverter#supplementContentText(String)}
     */
    @Test
    public void testSupplementContentText() {
        // input: "{\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]},\"###html###\":\"<p>Test1</p><p>Test2</p><p><br></p>\"}"
        // output: "{\"mdelta\":[{ \"insert\":\"test 1 \ntest 2\n\"}],\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]},\"###html###\":\"<p>Test1</p><p>Test2</p><p><br></p>\"}"


        // input: [{"insert":"test 1 \ntest 2\n"}]
        // output: "{\"mdelta\":[{ \"insert\":\"test 1 \ntest 2\n\"}],\"delta\":{\"ops\":[{\"insert\":\"Test1\\nTest2\\n\\n\"}]}}"
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
        Assert.assertEquals(JsonParser.parseString(mDeltaBold), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaBold)));
        Assert.assertEquals(JsonParser.parseString(mDeltaInsert), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaInsert)));
        Assert.assertEquals(JsonParser.parseString(mDeltaLink), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaLink)));
        Assert.assertEquals(JsonParser.parseString(mDeltaHeading1), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaHeading1)));
        Assert.assertEquals(JsonParser.parseString(mDeltaHeading2), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaHeading2)));
        Assert.assertEquals(JsonParser.parseString(mDeltaOrderList), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaOrderList)));
        Assert.assertEquals(JsonParser.parseString(mDeltaBulletList), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaBulletList)));
        Assert.assertEquals(JsonParser.parseString(mDeltaCodeBlock), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaCodeBlock)));
        Assert.assertEquals(JsonParser.parseString(mDeltaQuoteBlock), JsonParser.parseString(DeltaConverter.deltaTomDelta(deltaQuoteBlock)));


        // test mdelta -> delta
        Assert.assertEquals(JsonParser.parseString(deltaBold), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaBold)));
        Assert.assertEquals(JsonParser.parseString(deltaInsert), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaInsert)));
        Assert.assertEquals(JsonParser.parseString(deltaLink), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaLink)));
        Assert.assertEquals(JsonParser.parseString(deltaHeading1), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaHeading1)));
        Assert.assertEquals(JsonParser.parseString(deltaHeading2), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaHeading2)));
        Assert.assertEquals(JsonParser.parseString(deltaOrderList), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaOrderList)));
        Assert.assertEquals(JsonParser.parseString(deltaBulletList), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaBulletList)));
        Assert.assertEquals(JsonParser.parseString(deltaCodeBlock), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaCodeBlock)));
        Assert.assertEquals(JsonParser.parseString(deltaQuoteBlock), JsonParser.parseString(DeltaConverter.mDeltaToDelta(mDeltaQuoteBlock)));

    }

}