create index auditables_project_id_activity_time_index
	on auditables (project_id asc, activity_time desc);