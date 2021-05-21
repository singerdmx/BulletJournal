package com.bulletjournal.repository;

import com.bulletjournal.controller.models.BookingSlot;
import com.bulletjournal.controller.models.ProjectType;
import com.bulletjournal.controller.models.RecurringSpan;
import com.bulletjournal.controller.models.params.CreateBookingLinkParams;
import com.bulletjournal.controller.models.params.UpdateBookingLinkParams;
import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.exceptions.UnAuthorizedException;
import com.bulletjournal.repository.models.BookingLink;
import com.bulletjournal.repository.models.Project;
import com.bulletjournal.repository.utils.DaoHelper;
import com.bulletjournal.util.BookingUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class BookingLinkDaoJpa {

    @Autowired
    private BookingLinkRepository bookingLinkRepository;

    @Autowired
    private ProjectDaoJpa projectDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink getBookingLink(String id) {
        return this.bookingLinkRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking link " + id + " not found"));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteBookingLink(String requester, String id) {
        BookingLink bookingLink = getBookingLink(requester, id);
        this.bookingLinkRepository.delete(bookingLink);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink create(String id, String owner, CreateBookingLinkParams createBookingLinkParams) {
        Project project = this.projectDaoJpa.getProject(createBookingLinkParams.getProjectId(), owner);
        validateProject(project);
        BookingLink bookingLink = new BookingLink();
        bookingLink.setId(id);
        bookingLink.setOwner(owner);
        bookingLink.setBeforeEventBuffer(createBookingLinkParams.getBeforeEventBuffer());
        bookingLink.setAfterEventBuffer(createBookingLinkParams.getAfterEventBuffer());
        bookingLink.setStartDate(createBookingLinkParams.getStartDate());
        bookingLink.setEndDate(createBookingLinkParams.getEndDate());
        bookingLink.setExpireOnBooking(createBookingLinkParams.isExpireOnBooking());
        bookingLink.setIncludeTaskWithoutDuration(createBookingLinkParams.isIncludeTaskWithoutDuration());
        bookingLink.setSlotSpan(createBookingLinkParams.getSlotSpan());
        bookingLink.setTimezone(createBookingLinkParams.getTimezone());
        bookingLink.setRecurrences(BookingUtil.toString(createBookingLinkParams.getRecurrences()));
        bookingLink.setProject(project);
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }

    private void validateProject(Project project) {
        if (project.isShared()) {
            throw new BadRequestException("Project " + project.getName() + " is shared");
        }
        if (project.getType() != ProjectType.TODO.getValue()) {
            throw new BadRequestException("Project " + project.getName() + " is not TODO");
        }
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink updateSlot(String requester, String bookingLinkId, final BookingSlot slot) {
        BookingLink bookingLink = getBookingLink(requester, bookingLinkId);
        String updatedSlots = BookingUtil.updateBookingLinkSlot(slot, bookingLink);
        bookingLink.setSlots(updatedSlots);
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink updateRecurrences(String requester, String bookingLinkId, final List<RecurringSpan> recurrences) {
        BookingLink bookingLink = getBookingLink(requester, bookingLinkId);
        bookingLink.setRecurrences(BookingUtil.toString(recurrences));
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink partialUpdate(String requester, String bookingLinkId, UpdateBookingLinkParams updateBookingLinkParams) {
        BookingLink bookingLink = getBookingLink(requester, bookingLinkId);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasBeforeEventBuffer(), updateBookingLinkParams.getBeforeEventBuffer(),
                bookingLink::setBeforeEventBuffer);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasAfterEventBuffer(), updateBookingLinkParams.getAfterEventBuffer(),
                bookingLink::setAfterEventBuffer);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasExpireOnBooking(), updateBookingLinkParams.getExpireOnBooking(),
                bookingLink::setExpireOnBooking);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasIncludeTaskWithoutDuration(), updateBookingLinkParams.getIncludeTaskWithoutDuration(),
                bookingLink::setIncludeTaskWithoutDuration);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasNote(), updateBookingLinkParams.getNote(),
                bookingLink::setNote);

        DaoHelper.updateIfPresent(updateBookingLinkParams.hasLocation(), updateBookingLinkParams.getLocation(),
                bookingLink::setLocation);

        DaoHelper.updateIfPresent(updateBookingLinkParams.hasStartDate(), updateBookingLinkParams.getStartDate(),
                bookingLink::setStartDate);
        DaoHelper.updateIfPresent(updateBookingLinkParams.hasEndDate(), updateBookingLinkParams.getEndDate(),
                bookingLink::setEndDate);
        bookingLink.setTimezone(updateBookingLinkParams.getTimezone());
        if (updateBookingLinkParams.getProjectId() != null) {
            Project project = this.projectDaoJpa.getProject(updateBookingLinkParams.getProjectId(), requester);
            validateProject(project);
            bookingLink.setProject(project);
        }
        this.bookingLinkRepository.save(bookingLink);
        return bookingLink;
    }

    private BookingLink getBookingLink(String requester, String bookingLinkId) {
        BookingLink bookingLink = getBookingLink(bookingLinkId);
        if (!Objects.equals(requester, bookingLink.getOwner())) {
            throw new UnAuthorizedException("BookingLink " + bookingLinkId + " is owner by " +
                    bookingLink.getOwner() + " while request is from " + requester);
        }
        return bookingLink;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<com.bulletjournal.controller.models.BookingLink> getBookingLinks(String requester) {
        List<BookingLink> links = this.bookingLinkRepository.findAllByOwnerAndRemoved(requester, false);
        return links.stream()
                .map(BookingLink::toPresentationModel)
                .collect(Collectors.toList());
    }
}
