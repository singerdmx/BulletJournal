ALTER SEQUENCE "template".sample_task_sequence RESTART WITH 8000;
ALTER TABLE "template".sample_tasks ALTER COLUMN ID SET DEFAULT nextval('template.sample_task_sequence');