package com.bulletjournal.controller.models;

import com.bulletjournal.controller.utils.ZonedDateTimeHelper;

public class TransactionView extends Transaction {

    private Long paymentTime;

    public TransactionView() {
    }

    public TransactionView(Transaction transaction, Long paymentTime) {
        this.clone(transaction);
        this.paymentTime = paymentTime;
    }

    public static TransactionView getView(Transaction transaction) {
        String date = transaction.getDate();
        String time = transaction.getTime();
        String timezone = transaction.getTimezone();
        Long paymentTime = ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant().toEpochMilli();
        return new TransactionView(transaction, paymentTime);
    }

    public Long getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(Long paymentTime) {
        this.paymentTime = paymentTime;
    }
}
