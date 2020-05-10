delete from public.google_calendar_projects;
alter table public.google_calendar_projects
add owner varchar(100) not null;