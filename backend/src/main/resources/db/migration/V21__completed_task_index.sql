create index completed_tasks_project_id_created_at_index
	on completed_tasks (project_id, created_at);

create index completed_tasks_project_id_created_at_assignee_index 
    on completed_tasks using GIN (assignees, project_id, created_at);