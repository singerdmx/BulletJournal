package com.bulletjournal.clients;

import com.amazonaws.auth.AWSCredentials;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.bulletjournal.config.AWSConfig;
import com.bulletjournal.controller.utils.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import javax.annotation.PostConstruct;
import java.io.File;

@Component
public class AWSS3Client {

    @Autowired
    private AWSConfig awsConfig;

    private AmazonS3 amazonS3Client;

    @PostConstruct
    public void initializeAwsConnection() {
        if (awsConfig.getAWSAccessKey() == null || awsConfig.getAwsSecretKey() == null) {
            return;
        }

        AWSCredentials credentials = new BasicAWSCredentials(
                awsConfig.getAWSAccessKey(),
                awsConfig.getAwsSecretKey()
        );

        this.amazonS3Client = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.US_WEST_1)
                .build();
    }

    public String uploadFile(MultipartFile multipartFile) {
        if (this.amazonS3Client == null) {
            return "amazonS3Client not set up";
        }

        File file = null;
        try {
            file = FileUtil.convertMultiPartToFile(multipartFile);
            String fileName = FileUtil.generateFileName(multipartFile.getOriginalFilename());
            String fileUrl = awsConfig.getEndpointUrl() + "/" + awsConfig.getBucketName() + "/" + fileName;
            uploadFileTos3bucket(fileName, file);
            return fileUrl;
        } catch (Exception e) {
            throw new IllegalStateException(e);
        } finally {
            if (file != null) {
                file.delete();
            }
        }
    }

    private void uploadFileTos3bucket(String fileName, File file) {
        this.amazonS3Client.putObject(new PutObjectRequest(awsConfig.getBucketName(), fileName, file)
                .withCannedAcl(CannedAccessControlList.PublicRead));
    }
}