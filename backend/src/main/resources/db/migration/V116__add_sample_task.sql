alter table public.tasks
	add sample_task_id bigint;

alter table tasks
	add constraint "tasks__template.sample_tasks_fk"
		foreign key (sample_task_id) references template.sample_tasks
			on delete cascade;