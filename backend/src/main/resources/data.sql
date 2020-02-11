INSERT INTO public.users (id, created_at, updated_at, name, currency, timezone)
VALUES (0, '2020-02-11 05:01:54.960000', '2020-02-11 05:01:54.960000', 'BulletJournal', null, null);
INSERT INTO public.groups (id, created_at, updated_at, name, owner)
VALUES (0, '2020-02-11 05:01:55.055000', '2020-02-11 05:01:55.055000', 'Default', 'BulletJournal');
INSERT INTO public.user_groups (group_id, user_id, accepted) VALUES (0, 0, true);