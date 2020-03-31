package com.bulletjournal.util;

import org.junit.Assert;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;


/**
 * Tests {@link ContentDiffToolTest}
 */
@RunWith(SpringRunner.class)
@SpringBootTest(classes = ContentDiffTool.class)
@ActiveProfiles("test")
public class ContentDiffToolTest {

    @Autowired
    private ContentDiffTool contentDiffTool;

    @Test
    public void testComputeDiff() {
        String text1 = "An array of differences is computed which describe " +
                "the transformation of text1 into text2. Each difference is " +
                "an array (JavaScript, Lua) or tuple (Python) or Diff object" +
                " (C++, C#, Objective C, Java). The first element specifies" +
                " if it is an insertion (1), a deletion (-1) or an equality" +
                " (0). The second element specifies the affected text.";
        String text2 = "An array of differences is computed describe " +
                "the transformation of text1 into text2. Each difference is " +
                " (C++, C#, Objective C, Java). The first element specifies" +
                "an array (JavaScript, Lua) or tuple (Python) or Diff object" +
                " if it is an insertion (1), a deletion (-1) or an equality" +
                " (0). The second element specifies the affected text.";
        String text3 = "An array of differences is computed which describe " +
                "the transformation of text1 into text2. Each difference is " +
                "an array (JavaScript, Lua) or tuple (Python) or Diff object" +
                " (C++, C#, Objective C, Java). The first element specifies" +
                " if it is an insertion (1), a deletion (-1) or an equality" +
                " (0). The second element specifies the affected text." +
                "an array (JavaScript, Lua) or tuple (Python) or Diff object";
        String text4 = "";

        String diff12 = contentDiffTool.computeDiff(text1, text2);
        String diff23 = contentDiffTool.computeDiff(text2, text3);
        String diff13 = contentDiffTool.computeDiff(text1, text3);
        String diff34 = contentDiffTool.computeDiff(text3, text4);
        String result12 = contentDiffTool.applyDiff(text1, diff12);
        Assert.assertEquals(text2, result12);
        String result23 = contentDiffTool.applyDiff(text2, diff23);
        Assert.assertEquals(text3, result23);
        String result13 = contentDiffTool.applyDiff(text1, diff13);
        Assert.assertEquals(text3, result13);
        String result34 = contentDiffTool.applyDiff(text3, diff34);
        Assert.assertEquals(text4, result34);
    }
}
