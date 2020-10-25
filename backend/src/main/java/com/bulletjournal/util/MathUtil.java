package com.bulletjournal.util;

import java.util.Random;

public class MathUtil {
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
        Random random = new Random();
        return random.longs(min, max)
                .findFirst()
                .getAsLong();
    }
}
