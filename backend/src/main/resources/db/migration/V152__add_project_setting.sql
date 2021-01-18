create table project_settings
(
 project_id bigint not null
  constraint project_settings_projects_id_fk
   references projects
    on delete cascade,
 color varchar(100),
 auto_delete boolean default false not null
);

create unique index project_settings_project_id_uindex
 on project_settings (project_id);