create schema if not exists template;

create table if not exists template.categories (
    onerow_id integer primary key default 1,
    hierarchy text not null,
    constraint  onerow_id check (onerow_id = 1)
);
