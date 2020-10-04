alter table template.sample_tasks
	add refreshable boolean default false;

UPDATE template.sample_tasks
SET refreshable = true
WHERE id = 5003;

UPDATE template.sample_tasks
SET refreshable = true
WHERE id = 5002;

UPDATE template.sample_tasks
SET refreshable = true
WHERE id = 5001;

UPDATE template.sample_tasks
SET refreshable = true
WHERE id = 5000;
