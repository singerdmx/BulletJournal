package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.config.PaymentConfig;
import com.bulletjournal.controller.models.ConfirmPaymentIntent;
import com.bulletjournal.controller.models.CreatePaymentParams;
import com.bulletjournal.daemon.Cleaner;
import com.bulletjournal.repository.UserDaoJpa;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.validation.constraints.NotNull;


@RestController
public class PaymentController {

    protected static final String PAYMENT_INTENTS_ROUTE = "/api/paymentIntents";
    protected static final String PAYMENT_CONFIRM_ROUTE = "/api/paymentIntents/{paymentIntentId}";
    @Autowired
    private PaymentConfig paymentConfig;
    @Autowired
    private UserDaoJpa userDaoJpa;
    private static final Logger LOGGER = LoggerFactory.getLogger(Cleaner.class);

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

    @PostMapping(PAYMENT_CONFIRM_ROUTE)
    public ConfirmPaymentIntent confirmPaymentIntent(@PathVariable @NotNull String paymentIntentId) throws StripeException {
        PaymentIntent paymentIntent = PaymentIntent.retrieve(paymentIntentId);
        if (paymentIntent.getStatus().equals("succeeded")) {
            String username = MDC.get(UserClient.USER_NAME_KEY);
            int points = 0;
            switch (paymentIntent.getAmountReceived().intValue()) {
                case 500:
                    points = 100;
                    break;
                case 1000:
                    points = 250;
                    break;
                case 1500:
                    points = 500;
                    break;
            }
            String description = "Exchange " + points + " points for " + paymentIntent.getAmountReceived() / 100 + " dollars";
            Integer totalPoints = this.userDaoJpa.changeUserPoints(username, points, description);
            ConfirmPaymentIntent confirmPaymentIntent = new ConfirmPaymentIntent();
            confirmPaymentIntent.setPoints(totalPoints);
            return confirmPaymentIntent;
        } else {
            LOGGER.error("paymentIntentId {} not succeeded", paymentIntentId);
            throw new IllegalStateException("paymentIntent not succeeded");
        }
    }
}