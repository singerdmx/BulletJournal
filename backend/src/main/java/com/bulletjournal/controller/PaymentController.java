package com.bulletjournal.controller;

import com.bulletjournal.config.PaymentConfig;
import com.bulletjournal.controller.models.CreatePaymentParams;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class PaymentController {

    protected static final String PAYMENT_INTENTS_ROUTE = "/api/paymentIntents";
    @Autowired
    private PaymentConfig paymentConfig;

    @PostMapping(PAYMENT_INTENTS_ROUTE)
    public String createPaymentIntent(@RequestBody CreatePaymentParams createPaymentParams) throws StripeException {
        Stripe.apiKey = this.paymentConfig.getApiKey();
        PaymentIntentCreateParams params =
                PaymentIntentCreateParams.builder()
                        .setCurrency(createPaymentParams.getCurrency())
                        .setAmount(createPaymentParams.getAmount())
                        .putMetadata("integration_check", "accept_a_payment")
                        .build();
        PaymentIntent intent = PaymentIntent.create(params);
        return intent.getClientSecret();
    }

}