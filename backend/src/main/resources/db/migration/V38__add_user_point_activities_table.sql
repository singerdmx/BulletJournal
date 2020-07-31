CREATE SEQUENCE public.user_point_activity_sequence
    START WITH 100
    INCREMENT BY 2
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.user_point_activities (
    id bigint PRIMARY KEY,
    description character varying(255),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    username character varying(255),
    point_change integer,
    CONSTRAINT user_point_activities_foreign_key FOREIGN KEY (username) REFERENCES public.users(name) ON DELETE CASCADE
);

ALTER TABLE public.user_point_activities OWNER TO postgres;

CREATE INDEX user_point_activities_username_index ON public.user_point_activities USING btree(username)