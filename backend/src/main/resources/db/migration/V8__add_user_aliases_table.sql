CREATE TABLE public.user_aliases (
      owner character varying(255) PRIMARY KEY,
      created_at timestamp without time zone NOT NULL,
      updated_at timestamp without time zone NOT NULL,
      aliases text
);


ALTER TABLE public.user_aliases OWNER TO postgres;