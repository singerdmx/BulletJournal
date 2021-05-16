package com.bulletjournal.repository;

import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.models.params.CreateBookingLinkParams;
import com.bulletjournal.controller.models.params.UpdateBookingLinkParams;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.BookingLink;
import com.bulletjournal.repository.utils.DaoHelper;
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
        bookingLink.setExpireOnBooking(createBookingLinkParams.isExpireOnBooking());
        bookingLink.setIncludeTaskWithoutDuration(createBookingLinkParams.isIncludeTaskWithoutDuration());
        bookingLink.setSlotSpan(createBookingLinkParams.getSlotSpan());
        bookingLink.setTimezone(createBookingLinkParams.getTimezone());
        bookingLink.setRecurrences(BookingUtil.toString(createBookingLinkParams.getRecurrences()));
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

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink update(String bookingLinkId, UpdateBookingLinkParams updateBookingLinkParams) {
        BookingLink bookingLink = getBookingLink(bookingLinkId);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasBufferInMin(), updateBookingLinkParams.getBufferInMin(),
                bookingLink::setBufferInMin);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasExpireOnBooking(), updateBookingLinkParams.isExpireOnBooking(),
                bookingLink::setExpireOnBooking);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasIncludeTaskWithoutDuration(), updateBookingLinkParams.isIncludeTaskWithoutDuration(),
                bookingLink::setIncludeTaskWithoutDuration);
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }

}
