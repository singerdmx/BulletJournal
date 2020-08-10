--
-- Name: device_tokens; Type: TABLE; Schema: template; Owner: postgres
--

CREATE SEQUENCE template.category_sequence
    START WITH 100
    INCREMENT BY 2
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

create table if not exists template.categories (
    id bigint PRIMARY KEY,
    name character varying(255) not null,
    description text not null,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    unique (name)
);

create index category_name_index on template.categories using btree(name);