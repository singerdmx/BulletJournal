package com.bulletjournal.controller;

import com.bulletjournal.clients.AWSS3Client;
import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.filters.rate.limiting.TokenBucket;
import com.bulletjournal.filters.rate.limiting.TokenBucketType;
import com.bulletjournal.redis.RedisUserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Optional;

@RestController
public class FileController {
    private static final Logger LOGGER = LoggerFactory.getLogger(FileController.class);
    @Autowired
    private AWSS3Client awsS3Client;

    @Autowired
    private TokenBucket tokenBucket;

    @Autowired
    private UserClient userClient;

    @Autowired
    private RedisUserRepository redisUserRepository;

    @PostMapping("/api/uploadFile")
    public String uploadFile(@RequestPart(value = "file") MultipartFile file) {
        if (this.tokenBucket.isLimitExceeded(TokenBucketType.FILE_UPLOAD)) {
            LOGGER.error("File upload limit exceeded");
        }
        return this.awsS3Client.uploadFile(file);
    }

    @PostMapping("/api/uploadAvatar")
    public void uploadAvatar(@RequestPart(value = "file") MultipartFile file) throws IOException {
        if (this.tokenBucket.isLimitExceeded(TokenBucketType.FILE_UPLOAD)) {
            LOGGER.error("File upload limit exceeded");
        }
        String fileName = file.getOriginalFilename();
        LOGGER.info("Uploading avatar " + fileName);
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.userClient.uploadAvatar(file, username);

        LOGGER.info("Clearing " + username + " cache");
        Optional<User> userOptional = redisUserRepository.findById(username);
        if (userOptional.isPresent()) {
            this.redisUserRepository.delete(userOptional.get());
        }
    }
}
