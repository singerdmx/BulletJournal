package com.bulletjournal.controller.models;

import org.springframework.boot.test.web.client.TestRestTemplate;


public class RequestParams {
    private TestRestTemplate restTemplate;

    public TestRestTemplate getRestTemplate() {
        return restTemplate;
    }

    public void setRestTemplate(TestRestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public int getRandomServerPort() {
        return randomServerPort;
    }

    public void setRandomServerPort(int randomServerPort) {
        this.randomServerPort = randomServerPort;
    }

    private int randomServerPort;

    public RequestParams(TestRestTemplate testRestTemplate, int randomServerPort) {
        this.restTemplate = testRestTemplate;
        this.randomServerPort = randomServerPort;
    }
}
