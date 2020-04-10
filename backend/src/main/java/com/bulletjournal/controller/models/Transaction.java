package com.bulletjournal.controller.models;

import com.bulletjournal.contents.ContentType;
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
import java.util.*;

public class Transaction extends ProjectItem {
    @NotBlank
    @Size(min = 2, max = 100)
    private String payer;

    private String payerAvatar;

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


    public Transaction() {
    }

    @Override
    public ContentType getContentType() {
        return ContentType.TRANSACTION;
    }

    public Transaction(Long id,
                       @NotBlank String owner,
                       @NotBlank String name,
                       @NotNull Project project,
                       @NotBlank String payer,
                       @NotNull Double amount,
                       @NotNull String date,
                       String time,
                       @NotNull String timezone,
                       @NotNull Integer transactionType,
                       List<Label> labels) {
        super(id, name, owner, project, labels);
        this.payer = payer;
        this.amount = amount;
        this.date = date;
        this.time = time;
        this.timezone = timezone;
        this.transactionType = transactionType;
    }

    public String getPayer() {
        return payer;
    }

    public void setPayer(String payer) {
        this.payer = payer;
    }

    public String getPayerAvatar() {
        return payerAvatar;
    }

    public void setPayerAvatar(String payerAvatar) {
        this.payerAvatar = payerAvatar;
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

    public String getYearMonth() {
        return this.date.substring(0, 7);
    }

    public String getReadableYearMonth() {
        String m = this.date.substring(5, 7);
        String y = this.date.substring(0, 4);
        String month = Month.of(Integer.parseInt(m)).name();
        return y + " " + month;
    }

    public List<String> getWeek() {
        List<String> weekInfo = new ArrayList<>();

        // month year weekNum
        String year = date.substring(0, 4);
        String month = date.substring(5, 7);

        String oraceDt = date + " 00:00:00.0";
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss.S");
//        DateTimeFormatter formatter = DateTimeFormatter.ISO_LOCAL_DATE;
        ZonedDateTime zonedDateTime = ZonedDateTime.parse(oraceDt, formatter.withZone(ZoneId.of(timezone)));
        Calendar cal = GregorianCalendar.from(zonedDateTime);
        cal.setFirstDayOfWeek(Calendar.SUNDAY);

        int weekNumber = cal.get(Calendar.WEEK_OF_MONTH);

        String m = Month.of(Integer.parseInt(month)).name();
        weekInfo.add(year + " " + m + " Week " + weekNumber);


        cal.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);

        DateFormat df = new SimpleDateFormat("yyyy-MM-dd");
        String startDate = df.format(cal.getTime());

        cal.add(Calendar.DATE, 6);


        String endDate = df.format(cal.getTime());

        weekInfo.add(startDate + " " + endDate);

        return weekInfo;


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
}