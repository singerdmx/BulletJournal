alter table notes
    add contents_order varchar(10485760);

alter table tasks
    add contents_order varchar(10485760);

alter table transactions
    add contents_order varchar(10485760);