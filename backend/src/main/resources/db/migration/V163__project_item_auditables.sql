--
-- Name: note_auditables; Type: TABLE; Schema: public; Owner: postgres
--

DROP TABLE public.note_auditables;

CREATE TABLE public.note_auditables (
    id bigint not null
        constraint note_auditables_pkey
        primary key,
    note_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    activity character varying(512),
    originator character varying(512) NOT NULL,
    activity_time timestamp,
    action int,
    before_activity text,
    after_activity text
);

ALTER TABLE public.note_auditables OWNER TO postgres;

--
-- Name: note_auditables_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.note_auditables_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

create index note_auditables_note_id_activity_time_index
	on note_auditables (note_id asc, activity_time desc);

ALTER TABLE note_auditables
    ADD CONSTRAINT note_auditables_notes_id_fk
        FOREIGN KEY (note_id) REFERENCES notes
            ON DELETE CASCADE;



--
-- Name: task_auditables; Type: TABLE; Schema: public; Owner: postgres
--
DROP TABLE public.task_auditables;

CREATE TABLE public.task_auditables (
    id bigint not null
        constraint task_auditables_pkey
            primary key,
    task_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    activity character varying(512),
    originator character varying(512) NOT NULL,
    activity_time timestamp,
    action int,
    before_activity text,
    after_activity text
);

ALTER TABLE public.task_auditables OWNER TO postgres;

--
-- Name: task_auditables_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_auditables_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

create index task_auditables_task_id_activity_time_index
	on task_auditables (task_id asc, activity_time desc);

ALTER TABLE task_auditables
    ADD CONSTRAINT task_auditables_tasks_id_fk
        FOREIGN KEY (task_id) REFERENCES tasks
            ON DELETE CASCADE;



--
-- Name: transaction_auditables; Type: TABLE; Schema: public; Owner: postgres
--
DROP TABLE public.transaction_auditables;

CREATE TABLE public.transaction_auditables (
    id bigint not null
        constraint transaction_auditables_pkey
            primary key,
    transaction_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    activity character varying(512),
    originator character varying(512) NOT NULL,
    activity_time timestamp,
    action int,
    before_activity text,
    after_activity text
);

ALTER TABLE public.transaction_auditables OWNER TO postgres;

--
-- Name: transaction_auditables_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_auditables_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

create index transaction_auditables_transaction_id_activity_time_index
	on transaction_auditables (transaction_id asc, activity_time desc);

ALTER TABLE transaction_auditables
    ADD CONSTRAINT transaction_auditables_transactions_id_fk
        FOREIGN KEY (transaction_id) REFERENCES transactions
            ON DELETE CASCADE;