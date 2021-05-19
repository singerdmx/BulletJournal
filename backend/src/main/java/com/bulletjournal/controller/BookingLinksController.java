package com.bulletjournal.controller;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.BookingLink;
import com.bulletjournal.controller.models.params.CreateBookingLinkParams;
import com.bulletjournal.controller.models.params.UpdateBookingLinkParams;
import com.bulletjournal.controller.models.params.UpdateBookingLinkRecurrencesParams;
import com.bulletjournal.controller.models.params.UpdateBookingLinkSlotParams;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.BookingLinkDaoJpa;
import com.bulletjournal.repository.ProjectDaoJpa;
import com.bulletjournal.repository.TaskDaoJpa;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.models.Task;
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
import java.util.stream.Collectors;

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

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @PostMapping(BOOKING_LINKS_ROUTE)
    @ResponseStatus(HttpStatus.CREATED)
    public BookingLink createBookingLink(@Valid @RequestBody CreateBookingLinkParams createBookingLinkParams) {

        String uuid = RandomStringUtils.randomAlphabetic(8);
        String username = MDC.get(UserClient.USER_NAME_KEY);

        this.bookingLinkDaoJpa.create(uuid, username, createBookingLinkParams);
        return getBookingLink(uuid, createBookingLinkParams.getTimezone());
    }

    @GetMapping(BOOKING_LINKS_ROUTE)
    public List<BookingLink> getBookingLinks() {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        return this.bookingLinkDaoJpa.getBookingLinks(username);
    }

    @GetMapping(PUBLIC_BOOKING_LINK_ROUTE)
    public BookingLink getBookingLink(@NotNull @PathVariable String bookingLinkId, @RequestParam String timezone) {
        LOGGER.info("Create a new BookingLinks");
        com.bulletjournal.repository.models.BookingLink bookingLink =
                this.bookingLinkDaoJpa.getBookingLink(bookingLinkId);
        ZonedDateTime startTime = ZonedDateTimeHelper.getStartTime(
                bookingLink.getStartDate(), null, bookingLink.getTimezone());
        ZonedDateTime endTime = ZonedDateTimeHelper.getEndTime(
                bookingLink.getEndDate(), null, bookingLink.getTimezone());
        String username = MDC.get(UserClient.USER_NAME_KEY);
        List<Project> projects = this.projectDaoJpa.getUserProjects(username);
        List<Task> tasks = this.taskDaoJpa.getTasksBetween(username, startTime, endTime, projects)
                .stream().filter(t -> t.hasDueTime()).collect(Collectors.toList());

        BookingLink result = bookingLink.toPresentationModel();
        result.setSlots(BookingUtil.calculateSlots(
                bookingLink.getTimezone(),
                BookingUtil.getBookingLinkSlots(bookingLink),
                bookingLink.getStartDate(), bookingLink.getEndDate(), bookingLink.getSlotSpan(),
                bookingLink.isIncludeTaskWithoutDuration(), bookingLink.getBufferInMin(),
                timezone,
                tasks));

        List<com.bulletjournal.repository.models.Booking> bookings = bookingLink.getBookings();
        if (bookings != null) {
            result.setBookings(
                    bookings.stream()
                            .map(com.bulletjournal.repository.models.Booking::toPresentationModel)
                            .collect(Collectors.toList())
            );
        }
        return result;
    }

    @PatchMapping(BOOKING_LINK_ROUTE)
    public BookingLink updateBookingLink(@NotNull @PathVariable String bookingLinkId,
                                         @Valid @RequestBody UpdateBookingLinkParams updateBookingLinkParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.bookingLinkDaoJpa.partialUpdate(username, bookingLinkId, updateBookingLinkParams);
        return getBookingLink(bookingLinkId, updateBookingLinkParams.getTimezone());
    }

    @PostMapping(BOOKING_LINK_UPDATE_SLOT_ROUTE)
    public BookingLink updateBookingLinkSlot(
            @NotNull @PathVariable String bookingLinkId,
            @NotNull @RequestBody UpdateBookingLinkSlotParams updateBookingLinkSlotParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.bookingLinkDaoJpa.updateSlot(username, bookingLinkId, updateBookingLinkSlotParams.getBookingSlot());
        return getBookingLink(bookingLinkId, updateBookingLinkSlotParams.getTimezone());
    }

    @PostMapping(BOOKING_LINK_UPDATE_RECURRENCE_RULES_ROUTE)
    public BookingLink updateBookingLinkRecurrences(
            @NotNull @PathVariable String bookingLinkId,
            @NotNull @RequestBody UpdateBookingLinkRecurrencesParams updateBookingLinkRecurrencesParams) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.bookingLinkDaoJpa.updateRecurrences(username, bookingLinkId, updateBookingLinkRecurrencesParams.getRecurrences());
        return getBookingLink(bookingLinkId, updateBookingLinkRecurrencesParams.getTimezone());
    }

    @DeleteMapping(BOOKING_LINK_ROUTE)
    public void deleteBookingLink(@NotNull @PathVariable String bookingLinkId) {
        String username = MDC.get(UserClient.USER_NAME_KEY);
        this.bookingLinkDaoJpa.deleteBookingLink(username, bookingLinkId);
    }

}