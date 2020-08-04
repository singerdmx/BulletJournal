create schema if not exists template;

create table if not exists template.categories_hierarchy (
    onerow_id integer primary key default 1,
    hierarchy text not null,
    constraint  onerow_id check (onerow_id = 1)
);

insert into template.categories_hierarchy values (1, '[]');
