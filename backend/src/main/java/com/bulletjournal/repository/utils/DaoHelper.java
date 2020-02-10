package com.bulletjournal.repository.utils;

import java.util.function.Consumer;

public class DaoHelper {

    public static <T> void updateIfPresent(Boolean isPresent, T value, Consumer<T> getter) {
        if (isPresent) {
            getter.accept(value);
        }
    }
}
