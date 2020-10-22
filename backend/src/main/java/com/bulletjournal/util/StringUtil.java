package com.bulletjournal.util;

import org.apache.commons.lang3.StringUtils;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

public class StringUtil {

    public static final int UUID_LENGTH = 8;

    public static List<Long> convertNumArray(String numArray) {
        if (StringUtils.isBlank(numArray)) {
            return new ArrayList<>();
        }

        return Arrays.stream(numArray.split(","))
                .map(t -> Long.parseLong(t.trim())).sorted().collect(Collectors.toList());
    }
}
