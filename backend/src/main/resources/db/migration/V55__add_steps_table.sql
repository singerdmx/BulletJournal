alter table template.categories alter column name type varchar(100) using name::varchar(100);
alter table template.choices alter column name type varchar(100) using name::varchar(100);

CREATE SEQUENCE if not exists "template".step_sequence
	INCREMENT BY 10
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 8000
	CACHE 1
	NO CYCLE;

CREATE TABLE if not exists "template".steps (
	id bigint NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone NOT NULL,
	"name" varchar(100) NOT NULL,
	CONSTRAINT steps_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE "template".steps OWNER TO postgres;
GRANT ALL ON TABLE "template".steps TO postgres;
