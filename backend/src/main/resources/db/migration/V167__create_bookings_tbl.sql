ALTER TABLE public.booking_links DROP COLUMN invitees;

CREATE TABLE public.bookings
(
    id              varchar(8) PRIMARY KEY,
    booking_link_id varchar(8) NOT NULL,
    task_id         bigint     NOT NULL,
    invitee         text       NOT NULL,
    slot_index      int        NOT NULL,
    created_at      timestamp  NOT NULL,
    updated_at      timestamp  NOT NULL
);

-- booking links id fk
alter table bookings
    add constraint bookings_booking_link_id_fk
        foreign key (booking_link_id) references booking_links
            on delete cascade;

-- task id fk.
alter table bookings
    add constraint bookings_tasks_id_fk
        foreign key (task_id) references tasks
            on delete cascade;