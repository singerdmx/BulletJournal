drop table device_tokens;

CREATE TABLE public.device_tokens (
      id bigint PRIMARY KEY,
      token character varying(255),
      created_at timestamp without time zone NOT NULL,
      updated_at timestamp without time zone NOT NULL,
      username character varying(255),
      CONSTRAINT device_tokens_username_constraint FOREIGN KEY (username) REFERENCES users (name) ON DELETE CASCADE
);

ALTER TABLE public.device_tokens OWNER TO postgres;

CREATE INDEX device_tokens_username_index ON public.device_tokens USING btree(username)