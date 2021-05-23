package com.bulletjournal.repository.models;

import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import javax.persistence.*;

@Entity
@Table(name = "bookings")
public class Booking extends AuditModel {
  @Id private String id;

  @OneToOne(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
  @JoinColumn(name = "task_id", referencedColumnName = "id")
  private Task task;

  @ManyToOne(fetch = FetchType.LAZY, optional = false)
  @JoinColumn(name = "booking_link_id", referencedColumnName = "id", nullable = false)
  @OnDelete(action = OnDeleteAction.CASCADE)
  private BookingLink bookingLink;

  @Column
  private String invitees;

  @Column
  private String location;

  @Column
  private String note;

  @Column(name = "slot_index")
  private int slotIndex;

  @Column(name = "slot_date")
  private String slotDate;

  @Column(name = "requester_timezone")
  private String requesterTimeZone;

  public String getId() {
    return id;
  }

  public void setId(String id) {
    this.id = id;
  }

  public Task getTask() {
    return task;
  }

  public void setTask(Task task) {
    this.task = task;
  }

  public BookingLink getBookingLink() {
    return bookingLink;
  }

  public void setBookingLink(BookingLink bookingLink) {
    this.bookingLink = bookingLink;
  }

  public String getInvitees() {
    return invitees;
  }

  public void setInvitees(String invitees) {
    this.invitees = invitees;
  }

  public int getSlotIndex() {
    return slotIndex;
  }

  public void setSlotIndex(int slotIndex) {
    this.slotIndex = slotIndex;
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

  public String getSlotDate() {
    return slotDate;
  }

  public void setSlotDate(String slotDate) {
    this.slotDate = slotDate;
  }

  public String getRequesterTimeZone() {
    return requesterTimeZone;
  }

  public void setRequesterTimeZone(String requestTimeZone) {
    this.requesterTimeZone = requestTimeZone;
  }

    public com.bulletjournal.controller.models.Booking toPresentationModel() {
    return new com.bulletjournal.controller.models.Booking(
        this.getId(),
        this.getInvitees(),
        this.getSlotIndex(),
        this.getSlotDate(),
        this.getLocation(),
        this.getNote(),
        this.getRequesterTimeZone()
    );
  }
}
