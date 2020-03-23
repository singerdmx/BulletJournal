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
    private static AmazonS3 amazonS3;
    @Autowired
    private AWSConfig awsConfig;

    public String uploadFile(MultipartFile multipartFile) {
        String fileUrl = "";
        try {
            File file = FileUtil.convertMultiPartToFile(multipartFile);
            String fileName = FileUtil.generateFileName(multipartFile);
            fileUrl = awsConfig.getEndpointUrl() + "/" + awsConfig.getBucketName() + "/" + fileName;
            uploadFileTos3bucket(fileName, file);
            file.delete();
        } catch (Exception e) {
            e.printStackTrace();
        }
        return fileUrl;
    }

    private void uploadFileTos3bucket(String fileName, File file) {
        amazonS3.putObject(new PutObjectRequest(awsConfig.getBucketName(), fileName, file)
                .withCannedAcl(CannedAccessControlList.PublicRead));
    }

    @PostConstruct
    public void initializeAwsConnection() {
        AWSCredentials credentials = new BasicAWSCredentials(
                awsConfig.getAWSAccessKey(),
                awsConfig.getAwsSecretKey()
        );
        amazonS3 = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.US_WEST_1)
                .build();
    }
}