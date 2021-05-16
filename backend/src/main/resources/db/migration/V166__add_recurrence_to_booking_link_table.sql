alter table booking_links add recurrences text;

create index booking_links_owner_index
    on booking_links (owner);