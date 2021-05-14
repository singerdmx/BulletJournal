CREATE TABLE public.booking_links (
      id varchar(8) PRIMARY KEY,
      owner varchar(100) NOT NULL,
      start_date varchar(15),
      end_date varchar(15),
      timezone varchar(255),
      slot_span int,
      buffer_in_min int,
      slots text,
      invitees text,
      include_task_without_duration boolean,
      expire_on_booking boolean,
      created_at timestamp NOT NULL,
      updated_at timestamp NOT NULL
);
