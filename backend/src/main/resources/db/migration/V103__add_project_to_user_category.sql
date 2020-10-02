delete from template.users_categories;

alter table template.users_categories
    add project_id bigint not null;

alter table template.users_categories
    add constraint users_categories_projects_fk
        foreign key (project_id) references public.projects(id)
            on delete cascade;