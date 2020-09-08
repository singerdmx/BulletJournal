CREATE SEQUENCE if not exists "template".sample_task_sequence
	INCREMENT BY 2
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 100
	CACHE 1
	NO CYCLE;

CREATE TABLE if not exists "template".sample_tasks (
	id bigint NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone NOT NULL,
	metadata text,
	content text,
	"name" varchar(100) NOT NULL,
	CONSTRAINT sample_tasks_pkey PRIMARY KEY (id)
);

create table if not exists template.steps_sample_tasks (
    step_id bigint NOT NULL,
    sample_task_id bigint NOT NULL
);

-- Permissions

ALTER TABLE "template".sample_tasks OWNER TO postgres;
GRANT ALL ON TABLE "template".sample_tasks TO postgres;
