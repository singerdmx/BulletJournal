CREATE SEQUENCE if not exists "template".selection_sequence
	INCREMENT BY 2
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 100
	CACHE 1
	NO CYCLE;

CREATE TABLE if not exists "template".selections (
	id bigint NOT NULL,
	created_at timestamp without time zone NOT NULL,
	updated_at timestamp without time zone NOT NULL,
	icon varchar(255) NOT NULL,
	"text" varchar(255) NOT NULL,
	choice_id bigint NOT NULL,
	CONSTRAINT selections_pkey PRIMARY KEY (id),
	CONSTRAINT choice_foreign_key FOREIGN KEY (choice_id) REFERENCES template.choices(id) ON DELETE CASCADE
);

ALTER TABLE "template".selections OWNER TO postgres;
GRANT ALL ON TABLE "template".selections TO postgres;
