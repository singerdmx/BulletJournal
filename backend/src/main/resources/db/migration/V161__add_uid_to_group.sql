alter table groups
    add uid varchar(8);

create index groups_uid_index
    on groups (uid);