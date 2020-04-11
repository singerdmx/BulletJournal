package com.bulletjournal.controller.utils;

import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

public class FileUtil {

    public static File convertMultiPartToFile(MultipartFile file, String fileName) throws IOException {
        File convFile = new File(fileName);
        try (FileOutputStream fos = new FileOutputStream(convFile)) {
            byte[] byteArr = file.getBytes();
            if (byteArr.length > 25_000_000) {
                throw new IllegalArgumentException("File size cannot exceed 20MB");
            }
            fos.write(byteArr);
        }

        return convFile;
    }

    public static String generateFileName(String originalFilename) {
        return ZonedDateTimeHelper.getNow().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmssS")) +
                "-" + UUID.randomUUID().toString() + "-" +
                originalFilename.replace(" ", "_");
    }
}
