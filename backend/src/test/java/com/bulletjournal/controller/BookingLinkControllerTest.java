package com.bulletjournal.controller;

import com.bulletjournal.controller.models.*;
import com.bulletjournal.controller.models.params.*;
import com.bulletjournal.controller.utils.TestHelpers;
import com.google.common.collect.ImmutableList;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.client.TestRestTemplate;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit4.SpringRunner;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

import static org.junit.Assert.*;
import static org.junit.Assert.assertEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
public class BookingLinkControllerTest {

    private static final String ROOT_URL = "http://localhost:";

    private static final String TIMEZONE = "America/Los_Angeles";

    private static final String CENTRAL_TIMEZONE = "America/Chicago";

    private static final String LOCATION = "HOUSTON";

    private static final String NOTE = "TEST BOOKING LINKS NOTE";

    private final String expectedOwner = "BulletJournal";

    private static final String USER = "BulletJournal";

    @LocalServerPort
    int randomServerPort;
    private TestRestTemplate restTemplate = new TestRestTemplate();
    private RequestParams requestParams;

    @Before
    public void setup() {
        restTemplate.getRestTemplate().setRequestFactory(new HttpComponentsClientHttpRequestFactory());
        requestParams = new RequestParams(restTemplate, randomServerPort);
    }

    @Test
    public void testCRUD() throws Exception {

        Group group = TestHelpers.createGroup(requestParams, expectedOwner, "bookingLink_group");

        Project p1 = TestHelpers.createProject(requestParams, expectedOwner, "bookingLink_test", group, ProjectType.TODO);

        BookingLink bookingLink1 = createBookingLink("2021-05-04", "2021-06-01", TIMEZONE, 30, 0, false, true, p1.getId());
        BookingLink bookingLink2 = createBookingLink("2021-06-01", "2021-06-05", TIMEZONE, 60, 0, false, true, p1.getId());
        bookingLink1 = getBookingLink(bookingLink1.getId(), TIMEZONE);
        bookingLink2 = getBookingLink(bookingLink2.getId(), TIMEZONE);

        BookingSlot bookingSlot = new BookingSlot();
        bookingSlot.setIndex(0);
        bookingSlot.setStartTime("00:00");
        bookingSlot.setEndTime("00:30");
        bookingSlot.setDate("2021-05-04");
        bookingSlot.setOn(true);

        updateBookingLinkSlot(bookingLink1.getId(), bookingSlot);

        // test apply task
        testApplyTask(bookingLink2);

        deleteBookingLinkSlot(bookingLink2.getId());
        List<RecurringSpan> recurrences = new ArrayList<>();
        RecurringSpan recurrenceSpan = new RecurringSpan(
                30, "DTSTART:20200420T000000Z RRULE:FREQ=DAILY;INTERVAL=1;UNTIL=20200520T000000Z");
        recurrences.add(recurrenceSpan);
        updateBookingLinkRecurrences(bookingLink1.getId(), recurrences);

        UpdateBookingLinkParams updateBookingLinkParams = new UpdateBookingLinkParams();
        updateBookingLinkParams.setTimezone(CENTRAL_TIMEZONE);
        updateBookingLinkParams.setBufferInMin(60);
        updateBookingLinkParams.setLocation(LOCATION);
        updateBookingLinkParams.setNote(NOTE);

        patchBookingLink(bookingLink1.getId(), updateBookingLinkParams);

        BookingLink bookingLink3 = createBookingLink("2021-06-31", "2021-07-01", CENTRAL_TIMEZONE, 60, 0, false, true, p1.getId());

        getBookingLinks();

    }

    private BookingLink createBookingLink(String startDate, String endDate, String timezone, int slotSpan,
                                          int bufferInMin, boolean includeTaskWithoutDuration, boolean expireOnBooking, long projectId) {
        CreateBookingLinkParams createBookingLinkParams = new CreateBookingLinkParams(
                startDate, endDate, timezone,
                slotSpan, bufferInMin, includeTaskWithoutDuration, expireOnBooking,
                ImmutableList.of(new RecurringSpan(
                        30, "DTSTART:20200420T000000Z RRULE:FREQ=DAILY;INTERVAL=1;UNTIL=20200520T000000Z")),
                projectId);

        ResponseEntity<BookingLink> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BookingLinksController.BOOKING_LINKS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(createBookingLinkParams),
                BookingLink.class);
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        BookingLink bookingLink = response.getBody();
        assertNotNull(bookingLink);
        assertNotNull(bookingLink.getId());
        return bookingLink;
    }

    private BookingLink getBookingLink(String bookingLinkId, String timezone) {
        BookingLink bookingLink = getBookingLink(bookingLinkId, timezone, HttpStatus.OK);
        assertNotNull(bookingLink);
        assertNotNull(bookingLink.getId());
        return bookingLink;
    }

    private BookingLink getBookingLink(String bookingLinkId, String timezone, HttpStatus expectedStatusCode) {
        String url = ROOT_URL + randomServerPort + BookingLinksController.PUBLIC_BOOKING_LINK_ROUTE;
        url = UriComponentsBuilder.fromHttpUrl(url)
                .queryParam("timezone", timezone)
                .buildAndExpand(bookingLinkId)
                .toUriString();
        ResponseEntity<BookingLink> response = this.restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                BookingLink.class);
        assertEquals(expectedStatusCode, response.getStatusCode());
        BookingLink bookingLink = response.getBody();
        return bookingLink;
    }

    private BookingLink updateBookingLinkSlot(String bookingLinkId, BookingSlot bookingSlot) {
        ResponseEntity<BookingLink> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BookingLinksController.BOOKING_LINK_UPDATE_SLOT_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(new UpdateBookingLinkSlotParams(bookingSlot, TIMEZONE)),
                BookingLink.class,
                bookingLinkId);
        BookingLink bookingLink = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(bookingLink);
        assertEquals(bookingLink.getSlots().get(bookingSlot.getIndex()).isOn(), bookingSlot.isOn());
        return bookingLink;
    }

    private BookingLink updateBookingLinkRecurrences(String bookingLinkId, List<RecurringSpan> recurrences) {

        ResponseEntity<BookingLink> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BookingLinksController.BOOKING_LINK_UPDATE_RECURRENCE_RULES_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(new UpdateBookingLinkRecurrencesParams(recurrences, TIMEZONE)),
                BookingLink.class,
                bookingLinkId);
        BookingLink bookingLink = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertNotNull(bookingLink);
        assertEquals(bookingLink.getRecurrences().get(0).getDuration(), recurrences.get(0).getDuration());
        assertEquals(bookingLink.getRecurrences().get(0).getRecurrenceRule(), recurrences.get(0).getRecurrenceRule());
        return bookingLink;
    }

    private void deleteBookingLinkSlot(String bookingLinkId) {
        ResponseEntity<?> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BookingLinksController.BOOKING_LINK_ROUTE,
                HttpMethod.DELETE,
                null,
                Void.class,
                bookingLinkId);
        assertEquals(HttpStatus.OK, response.getStatusCode());
        getBookingLink(bookingLinkId, TIMEZONE, HttpStatus.NOT_FOUND);
    }

    private void patchBookingLink(String bookingLinkId, UpdateBookingLinkParams updateBookingLinkParams) {

        ResponseEntity<BookingLink> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BookingLinksController.BOOKING_LINK_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateBookingLinkParams),
                BookingLink.class,
                bookingLinkId
        );

        BookingLink bookingLink = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(bookingLink.getBufferInMin(), 60);
        assertEquals(bookingLink.getTimezone(), CENTRAL_TIMEZONE);
        assertEquals(bookingLink.getLocation(), LOCATION);
        assertEquals(bookingLink.getNote(), NOTE);
        assertNotNull(bookingLink);
    }

    private void getBookingLinks() {
        ResponseEntity<BookingLink[]> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BookingLinksController.BOOKING_LINKS_ROUTE,
                HttpMethod.GET,
                null,
                BookingLink[].class
        );

        List<BookingLink> bookingLinks = Arrays.asList(response.getBody());
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(bookingLinks.size(), 2);
        assertEquals(bookingLinks.get(1).getTimezone(), CENTRAL_TIMEZONE);
    }

    private void testApplyTask(BookingLink bookingLink) {
        Group group = TestHelpers.createGroup(requestParams, USER, "G1");
        List<String> users = new ArrayList<>();
        users.add("xlf");
        users.add("ccc");
        users.add("Joker");
        int count = 1;
        for (String username : users) {
            group = TestHelpers.addUserToGroup(this.requestParams, group, username, ++count, USER);
        }
        users.add(USER);
        Project p1 = TestHelpers.createProject(requestParams, USER, "p1", group, ProjectType.TODO);

        // test task with duration
        Task t1 = createTask(p1, new CreateTaskParams("t1", "2021-06-01",
                "10:00", 10, new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null));
        // overlap
        Task t2 = createTask(p1, new CreateTaskParams("t2", "2021-06-01",
                "13:00", 120, new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null));
        // in middle
        Task t3 = createTask(p1, new CreateTaskParams("t3", "2021-06-02",
                "15:30", 45, new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null));
        // cross day
        Task t4 = createTask(p1, new CreateTaskParams("t4", "2021-06-03",
                "23:15", 60, new ReminderSetting(), ImmutableList.of(USER), TIMEZONE, null));

        getBookingLink(bookingLink.getId(), TIMEZONE);

        // with buffer
        UpdateBookingLinkParams updateBookingLinkParams = new UpdateBookingLinkParams();
        updateBookingLinkParams.setBufferInMin(60);
        updateBookingLinkParams.setTimezone(TIMEZONE);
        ResponseEntity<BookingLink> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + BookingLinksController.BOOKING_LINK_ROUTE,
                HttpMethod.PATCH,
                new HttpEntity<>(updateBookingLinkParams),
                BookingLink.class,
                bookingLink.getId()
        );
        bookingLink = response.getBody();
        assertEquals(HttpStatus.OK, response.getStatusCode());


        getBookingLink(bookingLink.getId(), TIMEZONE);


    }

    private Task createTask(Project project, CreateTaskParams params) {
        ResponseEntity<Task> response = this.restTemplate.exchange(
                ROOT_URL + randomServerPort + TaskController.TASKS_ROUTE,
                HttpMethod.POST,
                new HttpEntity<>(params),
                Task.class,
                project.getId());
        Task created = response.getBody();
        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertNotNull(created);
        assertEquals(params.getName(), created.getName());
        assertEquals(project.getId(), created.getProjectId());
        return created;
    }
}
