package com.bulletjournal.util;

import org.apache.commons.lang3.StringUtils;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

public class StringUtil {
    public static List<Long> convertNumArray(String numArray) {
        if (StringUtils.isBlank(numArray)) {
            return Collections.emptyList();
        }

        return Arrays.stream(numArray.split(","))
                .map(t -> Long.parseLong(t)).sorted().collect(Collectors.toList());
    }
}
