package com.bulletjournal.controller.utils;

import org.springframework.util.DigestUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.List;
import java.util.Set;
import java.util.zip.Adler32;
import java.util.zip.Checksum;

/**
 * Etag Generator Class contains generate Etag
 * <p>
 * - To_Hash Code: Merge Hash Code of args into one String to hashing
 * - To_String: Concatenate String of args to one String for hashing
 */
public class EtagGenerator {

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

        outputBuilder.append("\"0");

        if (HashAlgorithm.MD5 == hashAlg) {
            // MD5 Hash
            try {
                // Convert input string into Byte Array
                InputStream inputStream = new ByteArrayInputStream(inputBuilder.toString().getBytes());
                DigestUtils.appendMd5DigestAsHex(inputStream, outputBuilder);
            } catch (IOException ex) {
                throw new IllegalStateException(ex);
            }
        } else if (HashAlgorithm.SHA256 == hashAlg) {
            // SHA256 Hash
            try {
                outputBuilder.append(
                        bytesToHex(MessageDigest.getInstance("SHA3_256").digest(inputBuilder.toString().getBytes())));
            } catch (NoSuchAlgorithmException ex) {
                throw new IllegalArgumentException(ex);
            }
        } else if (HashAlgorithm.ADLER32 == hashAlg) {
            // ALDER32 Hash
            try {
                Checksum checksum = new Adler32();
                checksum.update(inputBuilder.toString().getBytes(), 0, inputBuilder.toString().getBytes().length);
                outputBuilder.append(checksum.getValue());
            } catch (Exception ex) {
                throw new IllegalArgumentException(ex);
            }
        } else {
            // No Hash Function selected
            outputBuilder = inputBuilder;
        }

        outputBuilder.append('"' );
        return outputBuilder.toString();
    }

    private static String bytesToHex(byte[] hash) {
        StringBuilder hexString = new StringBuilder();
        for (byte b : hash) {
            String hex = Integer.toHexString(0xff & b);
            if (hex.length() == 1) hexString.append('0' );
            hexString.append(hex);
        }
        return hexString.toString();
    }

    public enum HashType {
        TO_HASHCODE, TO_STRING
    }

    public enum HashAlgorithm {
        MD5, ADLER32, SHA256
    }
}
