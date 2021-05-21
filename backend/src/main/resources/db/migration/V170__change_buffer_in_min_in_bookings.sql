alter table booking_links drop column buffer_in_min;

alter table booking_links
    add before_event_buffer integer not null;

alter table booking_links
    add after_event_buffer integer not null;