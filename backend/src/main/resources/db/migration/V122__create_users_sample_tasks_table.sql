create table if not exists template.users_sample_tasks
(
	user_id bigint not null
		constraint users_sample_tasks_users_id_fk
			references public.users
				on delete cascade,
	sample_task_id bigint not null
		constraint users_sample_tasks_sample_tasks_id_fk
			references template.sample_tasks
				on delete cascade,
    PRIMARY KEY (user_id, sample_task_id)
);

INSERT INTO template.users_sample_tasks (user_id, sample_task_id) VALUES (0, 5000);