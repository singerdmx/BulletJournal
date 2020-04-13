package com.bulletjournal.repository;

import com.bulletjournal.repository.models.CalendarToken;
import com.google.api.client.auth.oauth2.Credential;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Timestamp;

@Repository
public class CalendarTokenDaoJpa {
    @Autowired
    CalendarTokenRepository googleCalendarRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void merge(Credential credential, String owner) {
        CalendarToken calendarToken = googleCalendarRepository.findByOwner(owner);
        if (calendarToken == null) {
            calendarToken = new CalendarToken();
        }
        calendarToken.setGoogle(credential.getAccessToken());
        calendarToken.setGoogleTokenExpirationTime(new Timestamp(credential.getExpirationTimeMilliseconds().longValue()));
        calendarToken.setOwner(owner);
        googleCalendarRepository.save(calendarToken);
    }
}
