package com.bulletjournal.repository;

import com.bulletjournal.repository.models.BookingLink;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Repository
public class BookingLinkDaoJpa {
    @Autowired
    private BookingLinkRepository bookingLinkRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public BookingLink getBookingLink(String id) {
        Optional<BookingLink> bookingLinkOptional = this.bookingLinkRepository.findById(id);
        return bookingLinkOptional.orElseGet(BookingLink::new);
    }


}
