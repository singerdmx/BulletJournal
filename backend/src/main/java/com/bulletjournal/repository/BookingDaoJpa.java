package com.bulletjournal.repository;

import com.bulletjournal.controller.models.Invitee;
import com.bulletjournal.controller.models.ReminderSetting;
import com.bulletjournal.controller.models.params.CreateTaskParams;
import com.bulletjournal.controller.utils.ZonedDateTimeHelper;
import com.bulletjournal.repository.models.Booking;
import com.bulletjournal.repository.models.BookingLink;
import com.bulletjournal.repository.models.Task;
import com.google.common.collect.ImmutableList;
import com.google.gson.Gson;
import org.apache.commons.lang3.RandomStringUtils;
import org.apache.commons.lang3.StringUtils;
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
    private BookingLinkRepository bookingLinkRepository;

    @Autowired
    private TaskDaoJpa taskDaoJpa;

    @Autowired
    private UserDaoJpa userDaoJpa;

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


        note = prependInfoToNote(note, bookingLink, invitees);

        Task task = taskDaoJpa.create(
                bookingLink.getProject().getId(), bookingLink.getOwner(), createTaskParams, note);
        booking.setTask(task);
        booking = bookingRepository.save(booking);
        if (bookingLink.isExpireOnBooking()) {
            bookingLink.setRemoved(true);
        }
        this.bookingLinkRepository.save(bookingLink);
        return booking;
    }

    private String prependInfoToNote(String note, BookingLink bookingLink, List<Invitee> invitees) {
        StringBuilder sb = new StringBuilder();

        Invitee primaryInvitee = invitees.get(0);
        String primaryPhone = StringUtils.isBlank(primaryInvitee.getPhone()) ? "" : ", " + primaryInvitee.getPhone();
        String ownerEmail = this.userDaoJpa.getByName(bookingLink.getOwner()).getEmail();
        if (StringUtils.isBlank(ownerEmail)) {
            ownerEmail = "";
        } else {
            ownerEmail = " - " + ownerEmail;
        }

        String info = "{\"delta\": {\"ops\": [" + "{\"insert\": \"" + this.userDaoJpa.getBookMeUsername(bookingLink.getOwner())
                + "\"}" + ",{\"insert\": \"" + ownerEmail + "\\n\"},{\"insert\": \"" + primaryInvitee.getFirstName()
                + " " + primaryInvitee.getLastName() + " - " + primaryInvitee.getEmail() + primaryPhone + "\\n\"}";
        sb.append(info);

        for (int i = 1; i < invitees.size(); i++) {
            Invitee invitee = invitees.get(i);
            sb.append(",{\"insert\": \"");
            if (!StringUtils.isBlank(invitee.getFirstName())) {
                sb.append(invitee.getFirstName()).append(" ");
            }
            if (!StringUtils.isBlank(invitee.getLastName())) sb.append(invitee.getLastName());
            if (!StringUtils.isBlank(invitee.getFirstName()) || !StringUtils.isBlank(invitee.getLastName()))
                sb.append(" - ");
            sb.append(invitee.getEmail());
            if (!StringUtils.isBlank(invitee.getPhone())) {
                sb.append(", ");
                sb.append(invitee.getPhone());
            }
            sb.append("\\n\"}");
        }
        sb.append(",{\"insert\": \"\\n\"}");
        if (StringUtils.isNotBlank(note)) {
            String originalNote = note.substring(note.indexOf('[') + 1, note.indexOf(']'));
            if (StringUtils.isNotBlank(originalNote)) {
                sb.append(",").append(originalNote);
            }
        }
        sb.append(",{\"attributes\":{\"link\":\"https://bulletjournal.us/public/bookingLinks/");
        sb.append(bookingLink.getId());
        sb.append("\"},\"insert\":\"View event in Bullet Journal\"},{\"insert\": \"\\n\"}");
        sb.append("]}}");
        return sb.toString();
    }
}
