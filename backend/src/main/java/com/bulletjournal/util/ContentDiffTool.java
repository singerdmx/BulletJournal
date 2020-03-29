package com.bulletjournal.util;

import org.bitbucket.cowwoc.diffmatchpatch.DiffMatchPatch;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;

import java.util.LinkedList;
import java.util.List;

@Component
public class ContentDiffTool {

    private static final Logger LOGGER = LoggerFactory.getLogger(ContentDiffTool.class);

    private DiffMatchPatch diffMatchPatch = new DiffMatchPatch();

    private ContentDiffTool() {
    }

    public String computeDiff(String oldText, String newText) {
        return diffMatchPatch.patchToText(
                diffMatchPatch.patchMake(
                        diffMatchPatch.diffMain(oldText, newText)
                )
        );
    }

    public String applyDiff(String oldText, String diff) {
        List<DiffMatchPatch.Patch> patches = diffMatchPatch.patchFromText(diff);
        Object[] output = diffMatchPatch.patchApply(
                (LinkedList<DiffMatchPatch.Patch>) patches, oldText);
        String newText = (String) output[0];
        boolean[] status = (boolean[]) output[1];
        // check if all patches are applied successfully
        for (boolean s : status) {
            if (!s) {
                LOGGER.error("Some patches in diff failed to apply, old text:\n {}, \n diff:\n {}",
                        oldText, diff);
                break;
            }
        }
        return newText;
    }
}
