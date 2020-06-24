package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.Project;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Month;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Calendar;
import java.util.GregorianCalendar;
import java.util.List;
import java.util.Objects;

public class Transaction extends ProjectItem {

    @NotNull
    private User payer;

    @NotNull
    private Double amount;

    @NotBlank
    @Size(min = 10, max = 10)
    private String date;

    @NotNull
    private Integer transactionType;

    private String time;

    @NotBlank
    private String timezone;

    private Long paymentTime;


    public Transaction() {
    }

    public Transaction(Long id,
                       @NotNull User owner,
                       @NotBlank String name,
                       @NotNull Project project,
                       @NotNull User payer,
                       @NotNull Double amount,
                       @NotNull String date,
                       String time,
                       @NotNull String timezone,
                       @NotNull Integer transactionType,
                       @NotNull Long createdAt,
                       @NotNull Long updatedAt,
                       List<Label> labels) {
        super(id, name, owner, project, labels);
        this.payer = payer;
        this.amount = amount;
        this.date = date;
        this.time = time;
        this.timezone = timezone;
        this.transactionType = transactionType;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        getView(this);
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TRANSACTION;
    }

    public User getPayer() {
        return payer;
    }

    public void setPayer(User payer) {
        this.payer = payer;
    }

    public Double getAmount() {
        return amount;
    }

    public void setAmount(Double amount) {
        this.amount = amount;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getTime() {
        return time;
    }

    public void setTime(String time) {
        this.time = time;
    }

    public String getTimezone() {
        return this.timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public Integer getTransactionType() {
        return transactionType;
    }

    public void setTransactionType(Integer transactionType) {
        this.transactionType = transactionType;
    }

    public Long getPaymentTime() {
        return paymentTime;
    }

    public void setPaymentTime(Long paymentTime) {
        this.paymentTime = paymentTime;
    }

    public String getYear() {
        return this.date.substring(0, 4);
    }

    public String getMonth() {
        return this.date.substring(5, 7);
    }

    public String getYearMonth() {
        return this.date.substring(0, 7);
    }

    public String getReadableYearMonth() {
        String month = Month.of(Integer.parseInt(this.getMonth())).name();
        return this.getYear() + " " + month;
    }

    public String getReadableWeek() {
        Calendar cal = getCalendar();
        int weekNumber = cal.get(Calendar.WEEK_OF_MONTH);
        String m = Month.of(Integer.parseInt(this.getMonth())).name();
        return this.getYear() + " " + m + " Week " + weekNumber;
    }

    private Calendar getCalendar() {
        String oraceDt = date + " " + ZonedDateTimeHelper.DEFAULT_TIME;
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(ZonedDateTimeHelper.PATTERN);
        ZonedDateTime zonedDateTime = ZonedDateTime.parse(oraceDt, formatter.withZone(ZoneId.of(timezone)));
        Calendar cal = GregorianCalendar.from(zonedDateTime);
        cal.setFirstDayOfWeek(Calendar.SUNDAY);
        return cal;
    }

    public String getWeek() {
        Calendar cal = getCalendar();
        cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);

        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String startDate = df.format(cal.getTime());

        cal.add(Calendar.DATE, 6);

        String endDate = df.format(cal.getTime());
        return startDate + " " + endDate;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof Transaction)) return false;
        if (!super.equals(o)) return false;
        Transaction that = (Transaction) o;
        return Objects.equals(getPayer(), that.getPayer()) &&
                Objects.equals(getAmount(), that.getAmount()) &&
                Objects.equals(getDate(), that.getDate()) &&
                Objects.equals(getTransactionType(), that.getTransactionType()) &&
                Objects.equals(getTime(), that.getTime()) &&
                Objects.equals(getTimezone(), that.getTimezone());
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), getPayer(), getAmount(), getDate(), getTransactionType(), getTime(), getTimezone());
    }

    public static Transaction getView(Transaction transaction) {
        String date = transaction.getDate();
        String time = transaction.getTime();
        String timezone = transaction.getTimezone();
        Long paymentTime = ZonedDateTimeHelper.getStartTime(date, time, timezone).toInstant().toEpochMilli();
        transaction.setPaymentTime(paymentTime);
        return transaction;
    }
}