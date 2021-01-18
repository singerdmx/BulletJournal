package com.bulletjournal.util;

import org.junit.Assert;
import org.junit.Test;

public class DeltaContentTest {
    @Test
    public void testAdjustDelta() {
        String web = "{\"delta\":{\"ops\":[{\"insert\":{\"emoji\":\"joy\"}},{\"insert\":\"\\n\"}]}}";
        DeltaContent deltaContent = new DeltaContent(web);
        String adjustExpected = "{\"delta\":{\"ops\":[{\"insert\":\"\uD83D\uDE02\"},{\"insert\":\"\\n\"}]}}";
        Assert.assertEquals(adjustExpected, deltaContent.toJSON());
    }
}