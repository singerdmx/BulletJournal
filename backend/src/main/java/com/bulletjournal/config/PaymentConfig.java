package com.bulletjournal.config;

import org.springframework.context.annotation.Configuration;

@Configuration
public class PaymentConfig {
    public String getApiKey() {
        return System.getenv("PAYMENT_API_KEY");
    }
}
