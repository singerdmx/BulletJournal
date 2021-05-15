package com.bulletjournal.repository;

import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.models.params.CreateBookingLinkParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.BookingLink;
import com.bulletjournal.util.BookingUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class BookingLinkDaoJpa {

    @Autowired
    private BookingLinkRepository bookingLinkRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink getBookingLink(String id) {
        return this.bookingLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking link " + id + " not found"));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteBookingLink(String id) {
        this.bookingLinkRepository.deleteById(id);
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
        String updatedSlots = BookingUtil.updateBookingLinkSlot(slot, bookingLink);
        bookingLink.setSlots(updatedSlots);
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink updateRecurrences(String bookingLinkId, final List<String> recurrences) {
        BookingLink bookingLink = getBookingLink(bookingLinkId);
        bookingLink.setRecurrences(BookingUtil.toString(recurrences));
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }
}
