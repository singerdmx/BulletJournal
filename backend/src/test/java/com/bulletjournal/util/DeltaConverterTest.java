package com.bulletjournal.util;

import org.junit.Assert;
import org.junit.Test;

public class DeltaConverterTest {

    @Test
    public void converter() {
        String mDelta = "[{\"insert\":\"test Bold\",\"attributes\":{\"b\":true}},{\"insert\":\"\\n\"}]";
        String delta = "{\"delta\":{\"ops\":[{\"attributes\":{\"bold\":true},\"insert\":\"test Bold\"},{\"insert\":\"\\n\"}]}}";

        String mDeltaEx = "[{\"insert\":\"test Italic\",\"attributes\":{\"i\":true}},{\"insert\":\"\\n\"}]";
        String detlaEx = "{\"delta\":{\"ops\":[{\"attributes\":{\"italic\":true},\"insert\":\"test Italic\"},{\"insert\":\"\\n\"}]}}";

        Assert.assertEquals(delta.length(), DeltaConverter.mDeltaToDelta(mDelta).length());
        Assert.assertEquals(mDelta.length(), DeltaConverter.deltaTomDelta(delta).length());

        Assert.assertEquals(detlaEx.length(), DeltaConverter.mDeltaToDelta(mDeltaEx).length());
        Assert.assertEquals(mDelta.length(), DeltaConverter.deltaTomDelta(delta).length());
    }

}