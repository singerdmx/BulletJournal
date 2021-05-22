package com.bulletjournal.repository;

import com.bulletjournal.controller.models.Invitee;
import com.bulletjournal.controller.models.params.CreateTaskParams;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.Booking;
import com.bulletjournal.repository.models.BookingLink;
import com.google.gson.Gson;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.List;

@Repository
public class BookingDaoJpa {

    private static final Gson GSON = new Gson();

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Booking book(BookingLink bookingLink,
                        List<Invitee> invitees,
                        String location, String note, String slotDate, int slotIndex) {
        Booking booking = new Booking();
        booking.setId(RandomStringUtils.randomAlphabetic(8));
        booking.setInvitees(GSON.toJson(invitees));
        booking.setBookingLink(bookingLink);
        booking.setLocation(location);
        booking.setNote(note);
        booking.setSlotDate(slotDate);
        booking.setSlotIndex(slotIndex);


        List<String> assignees = new ArrayList<>();
        assignees.add(bookingLink.getOwner());

        ZonedDateTime zonedTime = ZonedDateTimeHelper.getStartTime(slotDate, null, bookingLink.getTimezone()).plusMinutes(slotIndex * bookingLink.getSlotSpan());

        CreateTaskParams createTaskParams = new CreateTaskParams(
                bookingLink.getOwner(),
                slotDate,
                slotDate + " " + ZonedDateTimeHelper.getTime(zonedTime),
                bookingLink.getSlotSpan(),
                null,
                assignees,
                bookingLink.getTimezone(),
                null,
                new ArrayList<>(),
                location
        );

        taskDaoJpa.create(bookingLink.getProject().getId(), bookingLink.getOwner(), createTaskParams);

        return bookingRepository.save(booking);
    }
}
