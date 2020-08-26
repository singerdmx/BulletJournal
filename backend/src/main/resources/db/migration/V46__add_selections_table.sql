-- Drop table

-- DROP TABLE "template".selections;

CREATE TABLE "template".selections (
	id bigint NOT NULL,
	created_at timestamp NOT NULL,
	updated_at timestamp NOT NULL,
	icon varchar(255) NOT NULL,
	"text" varchar(255) NOT NULL,
	choice_id bigint NOT NULL,
	CONSTRAINT selections_pkey PRIMARY KEY (id),
	CONSTRAINT fkk333p3bf7y3417x3rfd5fkxij FOREIGN KEY (choice_id) REFERENCES template.choices(id)
);

-- DROP SEQUENCE "template".selection_sequence;

CREATE SEQUENCE "template".selection_sequence
	INCREMENT BY 2
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 100
	CACHE 1
	NO CYCLE;

-- Permissions

ALTER TABLE "template".selections OWNER TO postgres;
GRANT ALL ON TABLE "template".selections TO postgres;
