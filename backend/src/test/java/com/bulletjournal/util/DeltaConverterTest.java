package com.bulletjournal.util;

import org.junit.Test;

public class DeltaConverterTest {

    @Test
    public void converter() {
        String mDelta = "[{\"insert\":\"test Bold\",\"attributes\":{\"b\":true}},{\"insert\":\"\\n\"}]";
        String delta = "{\"delta\":{\"ops\":[{\"attributes\":{\"bold\":true},\"insert\":\"test Bold\"},{\"insert\":\"\\n\"}]}}";

        String mDeltaEx = "[{\"insert\":\"test Italic\",\"attributes\":{\"i\":true}},{\"insert\":\"\\n\"}]";
        String detlaEx = "{\"delta\":{\"ops\":[{\"attributes\":{\"italic\":true},\"insert\":\"test Italic\"},{\"insert\":\"\\n\"}]}}";

        System.out.println(mDelta);
        System.out.println(delta);
        System.out.println(DeltaConverter.mDeltaToDelta(mDelta));
        System.out.println(DeltaConverter.deltaTomDelta(delta));

        System.out.println("=======test 2 =======");
        System.out.println(detlaEx);
        System.out.println(DeltaConverter.mDeltaToDelta(mDeltaEx));
        System.out.println(mDeltaEx);
        System.out.println(DeltaConverter.deltaTomDelta(detlaEx));
    }

}