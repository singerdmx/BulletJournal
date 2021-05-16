alter table booking_links add recurrences text;

create index booking_links_owner_index
    on booking_links (owner);

alter table booking_links
    add project_id bigint not null;

alter table booking_links
    add constraint booking_links_projects_id_fk
        foreign key (project_id) references projects
            on delete cascade;