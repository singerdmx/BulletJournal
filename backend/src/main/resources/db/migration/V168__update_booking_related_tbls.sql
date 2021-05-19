-- public.booking_links
alter table public.booking_links add column location varchar(500);
alter table public.booking_links add column note text;
alter table public.booking_links add column removed boolean default false;
drop index booking_links_owner_index;

create index booking_links_owner_removed_index
    on booking_links (owner, removed);

alter table public.bookings add column location varchar(500);
alter table public.bookings add column note text;

create index bookings_booking_link_id_index
    on bookings (booking_link_id);
