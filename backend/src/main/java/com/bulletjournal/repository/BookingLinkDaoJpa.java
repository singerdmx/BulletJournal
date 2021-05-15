package com.bulletjournal.repository;

import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.models.params.CreateBookingLinkParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.BookingLink;
import com.google.gson.Gson;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Repository
public class BookingLinkDaoJpa {
    private static final Gson GSON = new Gson();

    @Autowired
    private BookingLinkRepository bookingLinkRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink getBookingLink(String id) {
        return this.bookingLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking link " + id + " not found"));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink create(String id, String owner, CreateBookingLinkParams createBookingLinkParams) {
        BookingLink bookingLink = new BookingLink();
        bookingLink.setId(id);
        bookingLink.setOwner(owner);
        bookingLink.setBufferInMin(createBookingLinkParams.getBufferInMin());
        bookingLink.setStartDate(createBookingLinkParams.getStartDate());
        bookingLink.setEndDate(createBookingLinkParams.getEndDate());
        bookingLink.setExpireOnBooking(createBookingLinkParams.getExpireOnBooking());
        bookingLink.setIncludeTaskWithoutDuration(createBookingLinkParams.getIncludeTaskWithoutDuration());
        bookingLink.setSlotSpan(createBookingLinkParams.getSlotSpan());
        bookingLink.setTimezone(createBookingLinkParams.getTimezone());
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink updateSlot(String bookingLinkId, final BookingSlot slot) {
        BookingLink bookingLink = getBookingLink(bookingLinkId);
        List<BookingSlot> slots = StringUtils.isBlank(bookingLink.getSlots()) ? new ArrayList<>() :
                Arrays.asList(GSON.fromJson(bookingLink.getSlots(), BookingSlot[].class));

        Optional<BookingSlot> match = slots.stream().filter(s -> Objects.equals(s, slot)).findFirst();
        if (match.isPresent()) {
            match.get().setOn(slot.isOn());
        } else {
            slots.add(slot);
        }
        String updatedSlots = GSON.toJson(slots);
        bookingLink.setSlots(updatedSlots);
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }

}
