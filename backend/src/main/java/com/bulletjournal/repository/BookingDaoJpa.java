package com.bulletjournal.repository;

import com.bulletjournal.controller.models.Invitee;
import com.bulletjournal.repository.models.Booking;
import com.bulletjournal.repository.models.BookingLink;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class BookingDaoJpa {

    private static final Gson GSON = new Gson();

    @Autowired
    private BookingRepository bookingRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Booking book(BookingLink bookingLink,
                        List<Invitee> invitees,
                        String location, String note, String slotDate, int slotIndex) {
        Booking booking = new Booking();
        booking.setInvitees(GSON.toJson(invitees));
        booking.setBookingLink(bookingLink);
        booking.setLocation(location);
        booking.setNote(note);
        booking.setSlotDate(slotDate);
        booking.setSlotIndex(slotIndex);
        return bookingRepository.save(booking);
    }
}
