package com.bulletjournal.controller;

import com.bulletjournal.clients.AWSS3Client;
import com.bulletjournal.filters.rate.limiting.TokenBucket;
import com.bulletjournal.filters.rate.limiting.TokenBucketType;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FileController.class);
    @Autowired
    private AWSS3Client awsS3Client;

    @Autowired
    private TokenBucket tokenBucket;

    @PostMapping("/api/uploadFile")
    public String uploadFile(@RequestPart(value = "file") MultipartFile file) {
        if (this.tokenBucket.isLimitExceeded(TokenBucketType.FILE_UPLOAD)) {
            LOGGER.error("File upload limit exceeded");
        }
        return this.awsS3Client.uploadFile(file);
    }
}
