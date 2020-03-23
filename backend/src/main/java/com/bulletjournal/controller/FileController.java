package com.bulletjournal.controller;

import com.bulletjournal.clients.AWSS3Client;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
public class FileController {

    @Autowired
    private AWSS3Client awsS3Client;

    @PostMapping("/api/uploadFile")
    public String uploadFile(@RequestPart(value = "file") MultipartFile file) {
        return this.awsS3Client.uploadFile(file);
    }
}
