CREATE SEQUENCE if not exists "template".choice_sequence
	INCREMENT BY 2
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 100
	CACHE 1
	NO CYCLE;

CREATE TABLE if not exists "template".choices (
	id bigint NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone NOT NULL,
	multiple bool NOT NULL,
	"name" varchar(255) NOT NULL,
	CONSTRAINT choices_pkey PRIMARY KEY (id)
);

-- Permissions

ALTER TABLE "template".choices OWNER TO postgres;
GRANT ALL ON TABLE "template".choices TO postgres;
