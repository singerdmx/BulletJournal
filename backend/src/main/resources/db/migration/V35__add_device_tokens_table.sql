--
-- Name: device_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.device_token_sequence
    START WITH 100
    INCREMENT BY 2
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.device_tokens (
    id bigint PRIMARY KEY,
    token character varying(255),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    user_id bigint NOT NULL,
    CONSTRAINT device_tokens_foreign_key FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

ALTER TABLE public.device_tokens OWNER TO postgres;

CREATE INDEX device_tokens_user_index ON public.device_tokens USING btree(user_id)

