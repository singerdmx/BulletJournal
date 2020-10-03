create table if not exists template.selection_introduction
(
    id bigint not null,
	selection_id bigint not null references template.selections,
	image_link text,
	description text,
	title text,
	created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL

);

CREATE SEQUENCE if not exists "template".selection_introduction_sequence
INCREMENT BY 2
MINVALUE 1
MAXVALUE 9223372036854775807
START 800
CACHE 1
NO CYCLE;


