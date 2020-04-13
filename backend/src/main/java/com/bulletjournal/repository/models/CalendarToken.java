package com.bulletjournal.repository.models;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.sql.Timestamp;

@Entity
@Table(name = "calendar_tokens",
        indexes = {@Index(name = "calendar_token_owner_index", columnList = "owner")},
        uniqueConstraints = {
                @UniqueConstraint(columnNames = {"owner"})
        })
public class CalendarToken extends AuditModel {
    @Id
    @GeneratedValue(generator = "calendar_token_generator")
    @SequenceGenerator(
            name = "calendar_token_generator",
            sequenceName = "calendar_token_sequence",
            initialValue = 100
    )
    private Long id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false, updatable = false)
    private String owner;

    @Column
    private String google;

    @Column(name = "google_token_expiration_time")
    private Timestamp googleTokenExpirationTime;

    @Column
    private String microsoft;

    @Column(name = "microsoft_token_expiration_time")
    private Timestamp microsoftTokenExpirationTime;

    @Column
    private String apple;

    @Column(name = "apple_token_expiration_time")
    private Timestamp appleTokenExpirationTime;

    public String getOwner() {
        return owner;
    }

    public void setGoogleTokenExpirationTime(Timestamp timestamp) {
        this.googleTokenExpirationTime = timestamp;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGoogle() {
        return google;
    }

    public void setGoogle(String google) {
        this.google = google;
    }

    public String getMicrosoft() {
        return microsoft;
    }

    public void setMicrosoft(String microsoft) {
        this.microsoft = microsoft;
    }

    public String getApple() {
        return apple;
    }

    public void setApple(String apple) {
        this.apple = apple;
    }
}
