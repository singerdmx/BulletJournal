package com.bulletjournal.controller.utils;

import org.springframework.util.DigestUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

/**
 * Etag Generator Class contains generate Etag
 * <p>
 * - To_Hash Code: Merge Hash Code of args into one String to hashing
 * - To_String: Concatenate String of args to one String for hashing
 */
public class EtagGenerator {

    public enum HashType {
        TO_HASHCODE, TO_STRING
    }

    public enum HashAlgorithm {
        MD5, ADLER32, SHA256
    }

    public static <T> String getHash(HashType hashType, T arg) {
        if (hashType == HashType.TO_HASHCODE) {
            return String.valueOf(arg.hashCode());
        } else {
            return (arg instanceof String) ? (String) arg : arg.toString();
        }
    }

    @SafeVarargs
    public static <T> void inputStreamBuilder(HashType hashType, StringBuilder inputBuilder, T... args) {
        // Add all input strings into one string
        for (T arg : args) {
            if (arg instanceof List<?>) {
                List<?> list = (List<?>) arg;
                list.forEach(element -> {
                    inputBuilder.append(getHash(hashType, element));
                });
            } else if (arg instanceof Set<?>) {
                Set<?> set = (Set<?>) arg;
                set.forEach(element -> {
                    inputBuilder.append(getHash(hashType, element));
                });
            } else {
                inputBuilder.append(getHash(hashType, arg));
            }
        }
    }

    @SafeVarargs
    public static <T> String generateEtag(HashAlgorithm hashAlg, HashType hashType, T... args) {
        StringBuilder inputBuilder = new StringBuilder();
        StringBuilder outputBuilder = new StringBuilder();

        inputStreamBuilder(hashType, inputBuilder, args);

        // Convert input string into Byte Array
        InputStream inputStream = new ByteArrayInputStream(inputBuilder.toString().getBytes());
        outputBuilder.append("\"0");

        if (HashAlgorithm.MD5 == hashAlg) {
            // MD5 Hash
            try {
                DigestUtils.appendMd5DigestAsHex(inputStream, outputBuilder);
            } catch (IOException ex) {
                throw new IllegalStateException(ex);
            }
        } else {
            // No Hash Function selected
            outputBuilder = inputBuilder;
        }

        outputBuilder.append('"');
        return outputBuilder.toString();
    }
}
