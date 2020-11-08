package com.bulletjournal.util;

import java.util.Random;

public class MathUtil {

    private static final Random RND = new Random();

    public static double round(double value, int places) {
        if (places < 0) {
            throw new IllegalArgumentException();
        }

        long factor = (long) Math.pow(10, places);
        value = value * factor;
        long tmp = Math.round(value);
        return (double) tmp / factor;
    }

    public static long getRandomNumber(long min, long max) {
        return RND.longs(min, max + 1)
                .findFirst()
                .getAsLong();
    }
}
