package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.BookingLink;
import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.models.params.CreateBookingLinkParams;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.BookingLinkDaoJpa;
import com.bulletjournal.util.BookingUtil;
import org.apache.commons.lang3.RandomStringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import javax.validation.constraints.NotNull;
import java.time.ZonedDateTime;
import java.util.List;

@RestController
public class BookingLinksController {

    private static final Logger LOGGER = LoggerFactory.getLogger(BookingLinksController.class);
    public static final String BOOKING_LINKS_ROUTE = "/api/bookingLinks";
    public static final String BOOKING_LINK_UPDATE_RECURRENCE_RULES_ROUTE =
            "/api/bookingLinks/{bookingLinkId}/updateRecurrenceRules";
    public static final String BOOKING_LINK_UPDATE_SLOT_ROUTE = "/api/bookingLinks/{bookingLinkId}/updateSlot";
    public static final String BOOKING_LINK_ROUTE = "/api/bookingLinks/{bookingLinkId}";
    public static final String PUBLIC_BOOKING_LINKS_ROUTE_PREFIX = "/api/public/bookingLinks/";
    public static final String PUBLIC_BOOKING_LINK_ROUTE = PUBLIC_BOOKING_LINKS_ROUTE_PREFIX + "{bookingLinkId}";

    @Autowired
    private BookingLinkDaoJpa bookingLinkDaoJpa;

    @PostMapping(BOOKING_LINKS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public BookingLink createBookingLink(@Valid @RequestBody CreateBookingLinkParams createBookingLinkParams) {

        String uuid = RandomStringUtils.randomAlphabetic(8);
        String username = MDC.get(UserClient.USER_NAME_KEY);

        this.bookingLinkDaoJpa.create(uuid, username, createBookingLinkParams);
        return getBookingLink(uuid);
    }

    @GetMapping(PUBLIC_BOOKING_LINK_ROUTE)
    public BookingLink getBookingLink(@NotNull @PathVariable String bookingLinkId) {
        LOGGER.info("Create a new Empty Booking Links");
        com.bulletjournal.repository.models.BookingLink bookingLink =
                this.bookingLinkDaoJpa.getBookingLink(bookingLinkId);
        ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(
                bookingLink.getStartDate(), null, bookingLink.getTimezone());
        ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(
                bookingLink.getEndDate(), null, bookingLink.getTimezone());

        // get all tasks between startTime and endTime

        BookingLink result = bookingLink.toPresentationModel();
        result.setSlots(BookingUtil.calculateSlots(
                BookingUtil.getBookingLinkSlots(bookingLink),
                bookingLink.getStartDate(), bookingLink.getEndDate(), bookingLink.getSlotSpan()));
        return result;
    }

    @PostMapping(BOOKING_LINK_UPDATE_SLOT_ROUTE)
    public BookingLink updateBookingLinkSlot(
            @NotNull @PathVariable String bookingLinkId,
            @NotNull @RequestBody BookingSlot bookingSlot) {
        this.bookingLinkDaoJpa.updateSlot(bookingLinkId, bookingSlot);
        return getBookingLink(bookingLinkId);
    }

    @PostMapping(BOOKING_LINK_UPDATE_RECURRENCE_RULES_ROUTE)
    public BookingLink updateBookingLinkRecurrenceRule(@NotNull @PathVariable String bookingLinkId,
                                                       @RequestBody List<String> recurrenceRules) {
        this.bookingLinkDaoJpa.updateRecurrence(bookingLinkId, recurrenceRules);
        return getBookingLink(bookingLinkId);
    }

}
