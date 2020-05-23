delete from public.google_calendar_projects;

alter table public.google_calendar_projects
    add expiration timestamp not null;