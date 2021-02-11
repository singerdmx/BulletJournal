create table task_auditables
(
    task_id      bigint,
    auditable_id bigint
);

create table transaction_auditables
(
    transaction_id bigint,
    auditable_id   bigint
);

create table note_auditables
(
    note_id      bigint,
    auditable_id bigint
);

