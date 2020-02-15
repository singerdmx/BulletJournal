package com.bulletjournal.controller.utils;

import org.springframework.util.DigestUtils;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.Set;

/**
 * Etag Processor Class contains generate Etag
 *
 * - To_Hash Code: Merge Hash Code of args into one String to hashing
 * - To_String: Concatenate String of args to one String for hashing
 */
public class EtagGenerator {

    public enum HashType {
        TO_HASHCODE, TO_STRING
    }

    public static <T> String getHash(HashType hashType, T arg) {
        if(hashType == HashType.TO_HASHCODE) {
            return String.valueOf(arg.hashCode());
        }
        else {
            return (arg instanceof String)? (String)arg : arg.toString();
        }
    }

    public static <T> String generateEtag(HashType hashType, T... args) throws IOException {
        StringBuilder inputBuilder = new StringBuilder();
        StringBuilder outputBuilder = new StringBuilder();

        // Add all input strings into one string
        for(T arg : args) {
            if(arg instanceof List<?>) {
                List<?> list = (List<?>)arg;
                list.forEach(element -> {
                    inputBuilder.append(getHash(hashType, element));
                });
            }
            else if(arg instanceof Set<?>) {
                Set<?> set = (Set<?>)arg;
                set.forEach(element -> {
                    inputBuilder.append(getHash(hashType, element));
                });
            }
            else {
                inputBuilder.append(getHash(hashType, arg));
            }
        }

        // Convert input string into Byte Array
        InputStream inputStream = new ByteArrayInputStream(inputBuilder.toString().getBytes());
        outputBuilder.append("\"0");

        // MD5 Hash
        DigestUtils.appendMd5DigestAsHex(inputStream, outputBuilder);
        outputBuilder.append('"');

        return outputBuilder.toString();
    }
    /*
    public static String generateEtagFromProjectList(List<Project> projectList) throws IOException {
        StringBuilder inputBuilder = new StringBuilder();
        StringBuilder outputBuilder = new StringBuilder();

        // Add all input strings into one string
        for(Project project : projectList) {
            inputBuilder.append(project.toString());
        }

        // Convert input string into Byte Array
        InputStream inputStream = new ByteArrayInputStream(inputBuilder.toString().getBytes());
        outputBuilder.append("\"0");

        // MD5 Hash
        DigestUtils.appendMd5DigestAsHex(inputStream, outputBuilder);
        outputBuilder.append('"');

        return outputBuilder.toString();
    }
    */
}
