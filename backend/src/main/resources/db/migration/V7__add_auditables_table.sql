--
-- Name: auditable_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.auditable_sequence
    START WITH 200
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.auditable_sequence OWNER TO postgres;

--
-- Name: auditables; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.auditables (
      id bigint PRIMARY KEY,
      created_at timestamp without time zone NOT NULL,
      updated_at timestamp without time zone NOT NULL,
      activity character varying(255),
      originator character varying(100),
      project_id bigint NOT NULL,
      CONSTRAINT auditables_project_foreign_key FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE
);

ALTER TABLE public.auditables OWNER TO postgres;