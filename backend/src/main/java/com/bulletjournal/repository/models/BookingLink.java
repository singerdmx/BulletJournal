package com.bulletjournal.repository.models;

import com.bulletjournal.util.BookingUtil;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

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

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "project_id", nullable = false)
    @OnDelete(action = OnDeleteAction.CASCADE)
    private Project project;

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

    @Column(name = "buffer_in_min")
    private int bufferInMin;

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

    public int getBufferInMin() {
        return bufferInMin;
    }

    public void setBufferInMin(int bufferInMin) {
        this.bufferInMin = bufferInMin;
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

    public com.bulletjournal.controller.models.BookingLink toPresentationModel() {
        com.bulletjournal.controller.models.BookingLink bookingLink = new com.bulletjournal.controller.models.BookingLink(
                this.getId(),
                this.getOwner(),
                this.getStartDate(),
                this.getEndDate(),
                this.getSlotSpan(),
                this.getBufferInMin(),
                this.getTimezone(),
                this.isExpireOnBooking(),
                this.isIncludeTaskWithoutDuration(),
                BookingUtil.toList(this.getRecurrences()),
                this.project.toPresentationModel()
        );
        return bookingLink;
    }
}
