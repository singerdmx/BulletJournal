alter table transactions alter column end_time drop not null;

alter table transactions alter column start_time drop not null;

alter table transactions alter column date drop not null;

alter table transactions add recurrence_rule varchar(255);

alter table transactions add deleted_slots text;