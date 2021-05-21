package com.bulletjournal.repository.models;

import com.bulletjournal.util.BookingUtil;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;
import java.util.List;

@Entity
@Table(name = "booking_links")
public class BookingLink extends AuditModel {

    @Id
    private String id;

    @NotBlank
    @Size(min = 2, max = 100)
    @Column(length = 100, nullable = false, updatable = false)
    private String owner;

    @Column(name = "start_date")
    private String startDate;

    @Column(name = "end_date")
    private String endDate;

    private String slots;

    private String recurrences;

    private String timezone;

    private String location;

    private String note;

    private boolean removed;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "bookingLink")
    private List<Booking> bookings;

    public List<Booking> getBookings() {
        return bookings;
    }

    public void setBookings(List<Booking> bookings) {
        this.bookings = bookings;
    }

    public String getRecurrences() {
        return recurrences;
    }

    public void setRecurrences(String recurrences) {
        this.recurrences = recurrences;
    }

    @Column(name = "slot_span")
    private int slotSpan;

    @Column(name = "include_task_without_duration")
    private boolean includeTaskWithoutDuration;

    @Column(name = "expire_on_booking")
    private boolean expireOnBooking;

    @Column(name = "before_event_buffer")
    private int beforeEventBuffer;

    @Column(name = "after_event_buffer")
    private int afterEventBuffer;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getOwner() {
        return owner;
    }

    public void setOwner(String owner) {
        this.owner = owner;
    }

    public String getStartDate() {
        return startDate;
    }

    public void setStartDate(String startDate) {
        this.startDate = startDate;
    }

    public String getEndDate() {
        return endDate;
    }

    public void setEndDate(String endDate) {
        this.endDate = endDate;
    }

    public String getTimezone() {
        return timezone;
    }

    public void setTimezone(String timezone) {
        this.timezone = timezone;
    }

    public int getSlotSpan() {
        return slotSpan;
    }

    public void setSlotSpan(int slotSpan) {
        this.slotSpan = slotSpan;
    }

    public boolean isIncludeTaskWithoutDuration() {
        return includeTaskWithoutDuration;
    }

    public void setIncludeTaskWithoutDuration(boolean includeTaskWithoutDuration) {
        this.includeTaskWithoutDuration = includeTaskWithoutDuration;
    }

    public boolean isExpireOnBooking() {
        return expireOnBooking;
    }

    public void setExpireOnBooking(boolean expireOnBooking) {
        this.expireOnBooking = expireOnBooking;
    }

    public int getBeforeEventBuffer() {
        return beforeEventBuffer;
    }

    public void setBeforeEventBuffer(int beforeEventBuffer) {
        this.beforeEventBuffer = beforeEventBuffer;
    }

    public int getAfterEventBuffer() {
        return afterEventBuffer;
    }

    public void setAfterEventBuffer(int afterEventBuffer) {
        this.afterEventBuffer = afterEventBuffer;
    }

    public String getSlots() {
        return slots;
    }

    public void setSlots(String slots) {
        this.slots = slots;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public boolean isRemoved() {
        return removed;
    }

    public void setRemoved(boolean removed) {
        this.removed = removed;
    }

    public com.bulletjournal.controller.models.BookingLink toPresentationModel() {
        com.bulletjournal.controller.models.BookingLink bookingLink = new com.bulletjournal.controller.models.BookingLink(
                this.getId(),
                this.getOwner(),
                this.getStartDate(),
                this.getEndDate(),
                this.getSlotSpan(),
                this.getBeforeEventBuffer(),
                this.getAfterEventBuffer(),
                this.getTimezone(),
                this.isExpireOnBooking(),
                this.isIncludeTaskWithoutDuration(),
                BookingUtil.toList(this.getRecurrences()),
                this.project.toPresentationModel(),
                this.getLocation(),
                this.getNote()
        );
        return bookingLink;
    }
}
