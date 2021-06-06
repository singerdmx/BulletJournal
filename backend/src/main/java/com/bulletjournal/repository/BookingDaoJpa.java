package com.bulletjournal.repository;

import com.bulletjournal.clients.DaemonServiceClient;
import com.bulletjournal.controller.models.Invitee;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.models.params.CreateTaskParams;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.messaging.MessagingService;
import com.bulletjournal.repository.models.Booking;
import com.bulletjournal.repository.models.BookingLink;
import com.bulletjournal.repository.models.Task;
import com.bulletjournal.util.DeltaContent;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.time.ZonedDateTime;
import java.time.format.TextStyle;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.stream.Collectors;

@Repository
public class BookingDaoJpa {

    private static final Gson GSON = new Gson();

    private static final Logger LOGGER = LoggerFactory.getLogger(BookingDaoJpa.class);

    public static final String BASE_URL = "https://bulletjournal.us/public/";

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private BookingLinkRepository bookingLinkRepository;

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

    @Autowired
    private DaemonServiceClient daemonServiceClient;

    @Autowired
    private MessagingService messagingService;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Booking book(BookingLink bookingLink,
                        List<Invitee> invitees,
                        String location, String note, String slotDate, int slotIndex, String requesterTimezone, String startTime, String endTime, String displayDate) {
        Booking booking = new Booking();
        booking.setId(RandomStringUtils.randomAlphabetic(8));
        booking.setInvitees(GSON.toJson(invitees));
        booking.setBookingLink(bookingLink);
        booking.setLocation(location);
        booking.setNote(note);
        booking.setSlotDate(slotDate);
        booking.setSlotIndex(slotIndex);
        booking.setRequesterTimeZone(requesterTimezone);
        booking.setStartTime(startTime);
        booking.setEndTime(endTime);
        booking.setDisplayDate(displayDate);

        List<String> assignees = ImmutableList.of(bookingLink.getOwner());
        ZonedDateTime zonedTime = ZonedDateTimeHelper.getStartTime(slotDate, null, bookingLink.getTimezone())
                .plusMinutes(slotIndex * bookingLink.getSlotSpan());

        Invitee primaryInvitee = invitees.get(0);

        ReminderSetting reminderSetting = new ReminderSetting(null, null, 3);

        CreateTaskParams createTaskParams = new CreateTaskParams(
                this.userDaoJpa.getBookMeUsername(bookingLink.getOwner()) + " and "
                        + primaryInvitee.getFirstName() + " " + primaryInvitee.getLastName(),
                slotDate,
                ZonedDateTimeHelper.getTime(zonedTime),
                bookingLink.getSlotSpan(),
                reminderSetting,
                assignees,
                bookingLink.getTimezone(),
                null,
                new ArrayList<>(),
                location
        );

        ZonedDateTime dateTime = ZonedDateTimeHelper.convertDateAndTime(displayDate, startTime, requesterTimezone);
        String dayOfWeek = dateTime.getDayOfWeek().getDisplayName(TextStyle.FULL, Locale.getDefault());

        String ownerBookMeUsername = this.userDaoJpa.getBookMeUsername(bookingLink.getOwner());
        String deltaNote = "{\"delta\": {\"ops\": [" + prependInfoToNote(note, bookingLink, invitees)
                + prependLinkInContent(bookingLink, ownerBookMeUsername, false);
        deltaNote += "]}}";

        Task task = taskDaoJpa.create(
                bookingLink.getProject().getId(), bookingLink.getOwner(), createTaskParams, deltaNote);
        booking.setTask(task);
        booking = bookingRepository.save(booking);
        if (bookingLink.isExpireOnBooking()) {
            bookingLink.setRemoved(true);
        }
        this.bookingLinkRepository.save(bookingLink);

        // send booking email
        List<String> contents = new ArrayList<>();
        contents.add(createContent(note, bookingLink, invitees, booking, this.userDaoJpa.getBookMeUsername(bookingLink.getOwner()), dayOfWeek));
        contents.add(createContent(note, bookingLink, invitees, booking, invitees.get(0).getFirstName() + " " + invitees.get(0).getLastName(), dayOfWeek));
        Booking finalBooking = booking;
        contents.addAll(invitees.stream().skip(1).map(i ->
                createContent(note, bookingLink, invitees, finalBooking, null, dayOfWeek)).collect(Collectors.toList()));
        sendBookingEmail(contents, invitees, booking, bookingLink, dayOfWeek);

        return booking;
    }

    private String prependInfoToNote(String note, BookingLink bookingLink, List<Invitee> invitees) {
        StringBuilder sb = new StringBuilder();
        Invitee primaryInvitee = invitees.get(0);
        String primaryPhone = StringUtils.isBlank(primaryInvitee.getPhone()) ? "" : " " + primaryInvitee.getPhone();
        String ownerEmail = this.userDaoJpa.getByName(bookingLink.getOwner()).getEmail();
        if (StringUtils.isBlank(ownerEmail)) {
            ownerEmail = "";
        } else {
            ownerEmail = " " + ownerEmail;
        }

        String info =
                "{\"insert\": \"" + this.userDaoJpa.getBookMeUsername(bookingLink.getOwner())
                        + "\"}" + ",{\"insert\": \"" + ownerEmail + "\\n\"},{\"insert\": \"" + primaryInvitee.getFirstName()
                        + " " + primaryInvitee.getLastName() + " " + primaryInvitee.getEmail() + primaryPhone + "\\n\"}";
        sb.append(info);

        for (int i = 1; i < invitees.size(); i++) {
            Invitee invitee = invitees.get(i);
            sb.append(",{\"insert\": \"");
            if (!StringUtils.isBlank(invitee.getFirstName())) {
                sb.append(invitee.getFirstName()).append(" ");
            }
            if (!StringUtils.isBlank(invitee.getLastName())) sb.append(invitee.getLastName());
            if (!StringUtils.isBlank(invitee.getFirstName()) || !StringUtils.isBlank(invitee.getLastName()))
                sb.append(" ");
            sb.append(invitee.getEmail());
            if (!StringUtils.isBlank(invitee.getPhone())) {
                sb.append(" ");
                sb.append(invitee.getPhone());
            }
            sb.append("\\n\"}");
        }
        sb.append(",{\"insert\": \"\\n\"}");
        if (StringUtils.isNotBlank(note)) {
            String originalNote = note.substring(note.indexOf('[') + 1, note.lastIndexOf(']'));
            if (StringUtils.isNotBlank(originalNote)) {
                sb.append(",").append(originalNote);
            }
        }

        return sb.toString();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void cancel(String bookingId) {
        this.bookingRepository.deleteById(bookingId);
    }

    private String prependLinkInContent(BookingLink bookingLink, String user, boolean isForEmail) {
        String s = ",{\"attributes\":{\"link\":\"" + BASE_URL;
        if (!isForEmail) {
            return s + "bookingLinks/" + bookingLink.getId()
                    + "\"},\"insert\":\"View event in Bullet Journal\"},{\"insert\": \"\\n\"}";
        }
        return s + "bookings/" + bookingLink.getId() + "?name=" + user
                + "\"},\"insert\":\"Cancel / reschedule event\"},{\"insert\": \"\\n\"}";
    }

    private void sendBookingEmail(List<String> contents, List<Invitee> invitees,
                                  Booking booking, BookingLink bookingLink, String dayOfWeek) {
        List<String> html = contents.stream().map(this::convert).collect(Collectors.toList());
        String primaryName = invitees.get(0).getFirstName() + " " + invitees.get(0).getLastName();
        String emailSubject = bookingLink.getSlotSpan() + " Minutes Booking - " + this.userDaoJpa.getBookMeUsername(bookingLink.getOwner()) + " and "
                + primaryName + " on " + dayOfWeek + " " + booking.getDisplayDate() + " from "
                + booking.getStartTime() + " to " + booking.getEndTime();

        messagingService.sendBookingEmailsToUser(this.userDaoJpa.getBookMeUsername(bookingLink.getOwner()), invitees, emailSubject, html);

    }

    private String createContent(String note, BookingLink bookingLink, List<Invitee> invitees, Booking booking,
                                 String receiver, String dayOfWeek) {
        // receiver is null if is guests
        // owner's book me username
        // firstname lastname
        StringBuilder sb = new StringBuilder();
        sb.append("{\"delta\": {\"ops\": [");

        // event info
        String info = "{\"insert\": \"A new event has been scheduled.\\n\\n\"},{\"attributes\": {\"bold\": true},\"insert\": " +
                "\"Event Type:\"},{\"insert\": \"\\n\"},{\"insert\": \"" + bookingLink.getSlotSpan()
                + " minutes\\n\"},{\"insert\": \"\\n\"},{\"attributes\": {\"bold\": true},\"insert\": " +
                "\"Event Date/Time:\"},{\"insert\": \"\\n\"},{\"insert\": \"" + booking.getStartTime() + " - "
                + booking.getEndTime() + " on " + dayOfWeek + " " + booking.getDisplayDate() + " (" + booking.getRequesterTimeZone()
                + ")\\n\"}"
                + ",{\"insert\": \"\\n\"}" + ",{\"attributes\": {\"bold\": true}," +
                "\"insert\": \"Attendees:\"},{\"insert\": \"\\n\"},";

        sb.append(info);
        // add invitees info
        sb.append(prependInfoToNote(note, bookingLink, invitees));

        if (!StringUtils.isBlank(receiver)) {
            receiver = encodeValue(receiver);
            sb.append(prependLinkInContent(bookingLink, receiver, true));
        }
        sb.append("]}}");

        return sb.toString();
    }

    private String encodeValue(String value) {
        try {
            return URLEncoder.encode(value, "UTF-8");
        } catch (UnsupportedEncodingException e) {
            LOGGER.error("Fail to encode value {}", value);
            return null;
        }
    }

    private String convert(String newText) {
        try {
            DeltaContent newContent = new DeltaContent(newText);
            return this.daemonServiceClient.convertDeltaToHtml(newContent.getDeltaOpsString());
        } catch (Exception ex) {
            LOGGER.error("Fail to adjustContentText: {}", newText);
            return null;
        }
    }
}
