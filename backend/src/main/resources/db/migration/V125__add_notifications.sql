INSERT INTO public.notifications (id, created_at, updated_at, actions, content, content_id, link, originator,
                                  target_user, title, type)
VALUES
(10, '2020-10-06 14:40:10.000000', '2020-10-06 14:40:13.000000', null, null, 5000, '/admin/sampleTasks/5000',
        'BulletJournal', 'BulletJournal', 'New Sample Task: Snowflake (SNOW) goes public on 2020-09-21', 'NewSampleTaskEvent'),
(11, '2020-10-06 14:40:10.000000', '2020-10-06 14:40:13.000000', null, null, 5000, '/admin/sampleTasks/5000',
        'BulletJournal', 'Thinker', 'New Sample Task: Snowflake (SNOW) goes public on 2020-09-21', 'NewSampleTaskEvent'),
(12, '2020-10-06 14:40:10.000000', '2020-10-06 14:40:13.000000', null, null, 5000, '/admin/sampleTasks/5000',
        'BulletJournal', 'Joker', 'New Sample Task: Snowflake (SNOW) goes public on 2020-09-21', 'NewSampleTaskEvent');

INSERT INTO template.sample_task_notifications (id, notifications)
VALUES (5000, '10,11,12');