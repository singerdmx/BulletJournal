--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

-- CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'md543225d7c19e7b7bd74e416fe9566a7f9';

CREATE SCHEMA IF NOT EXISTS public;

--
-- Databases


--
-- Database "postgres" dump
--

-- connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 12.2 (Debian 12.2-2.pgdg100+1)
-- Dumped by pg_dump version 12.2 (Debian 12.2-2.pgdg100+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: calendar_token_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.calendar_token_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.calendar_token_sequence OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: calendar_tokens; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.calendar_tokens (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    apple character varying(255),
    apple_token_expiration_time timestamp without time zone,
    google character varying(255),
    google_token_expiration_time timestamp without time zone,
    microsoft character varying(255),
    microsoft_token_expiration_time timestamp without time zone,
    owner character varying(100) NOT NULL
);


ALTER TABLE public.calendar_tokens OWNER TO postgres;

--
-- Name: completed_task_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.completed_task_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.completed_task_sequence OWNER TO postgres;

--
-- Name: completed_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.completed_tasks (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(100) NOT NULL,
    owner character varying(100) NOT NULL,
    labels bigint[],
    assignees text[],
    due_date character varying(15),
    due_time character varying(10),
    duration integer,
    end_time timestamp without time zone,
    google_calendar_event_id character varying(255),
    recurrence_rule character varying(255),
    reminder_before_task integer,
    reminder_date character varying(15),
    reminder_date_time timestamp without time zone,
    reminder_time character varying(10),
    start_time timestamp without time zone,
    timezone character varying(255) NOT NULL,
    contents text,
    project_id bigint NOT NULL
);


ALTER TABLE public.completed_tasks OWNER TO postgres;

--
-- Name: google_calendar_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.google_calendar_projects (
    id character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    channel character varying(5000),
    channel_id character varying(255),
    project_id bigint NOT NULL
);


ALTER TABLE public.google_calendar_projects OWNER TO postgres;

--
-- Name: google_credentials; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.google_credentials (
    key character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    access_token character varying(255),
    expiration_time_milliseconds bigint,
    refresh_token character varying(255)
);


ALTER TABLE public.google_credentials OWNER TO postgres;

--
-- Name: group_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.group_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.group_sequence OWNER TO postgres;

--
-- Name: groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.groups (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(100) NOT NULL,
    owner character varying(100) NOT NULL,
    default_group boolean NOT NULL
);


ALTER TABLE public.groups OWNER TO postgres;

--
-- Name: label_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.label_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.label_sequence OWNER TO postgres;

--
-- Name: labels; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.labels (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(100) NOT NULL,
    owner character varying(100) NOT NULL,
    icon character varying(100)
);


ALTER TABLE public.labels OWNER TO postgres;

--
-- Name: note_content_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.note_content_sequence
    START WITH 200
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.note_content_sequence OWNER TO postgres;

--
-- Name: note_contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.note_contents (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    base_text text,
    owner character varying(100) NOT NULL,
    revisions text,
    text text,
    note_id bigint NOT NULL
);


ALTER TABLE public.note_contents OWNER TO postgres;

--
-- Name: note_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.note_sequence
    START WITH 200
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.note_sequence OWNER TO postgres;

--
-- Name: notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notes (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(100) NOT NULL,
    owner character varying(100) NOT NULL,
    labels bigint[],
    project_id bigint NOT NULL
);


ALTER TABLE public.notes OWNER TO postgres;

--
-- Name: notification_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.notification_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.notification_sequence OWNER TO postgres;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.notifications (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    actions character varying(255),
    content character varying(255),
    content_id bigint,
    link character varying(255),
    originator character varying(100) NOT NULL,
    target_user character varying(100) NOT NULL,
    title character varying(255) NOT NULL,
    type character varying(100) NOT NULL
);


ALTER TABLE public.notifications OWNER TO postgres;

--
-- Name: project_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.project_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.project_sequence OWNER TO postgres;

--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(100) NOT NULL,
    owner character varying(100) NOT NULL,
    description character varying(255),
    shared boolean DEFAULT false NOT NULL,
    type integer NOT NULL,
    group_id bigint NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: public_project_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.public_project_items (
    id character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    expiration_time timestamp without time zone,
    username character varying(255),
    note_id bigint,
    task_id bigint
);


ALTER TABLE public.public_project_items OWNER TO postgres;

--
-- Name: shared_project_item_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.shared_project_item_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.shared_project_item_sequence OWNER TO postgres;

--
-- Name: shared_project_items; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.shared_project_items (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    username character varying(255),
    note_id bigint,
    task_id bigint,
    transaction_id bigint
);


ALTER TABLE public.shared_project_items OWNER TO postgres;

--
-- Name: task_content_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_content_sequence
    START WITH 200
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_content_sequence OWNER TO postgres;

--
-- Name: task_contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task_contents (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    base_text text,
    owner character varying(100) NOT NULL,
    revisions text,
    text text,
    task_id bigint NOT NULL
);


ALTER TABLE public.task_contents OWNER TO postgres;

--
-- Name: task_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.task_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.task_sequence OWNER TO postgres;

--
-- Name: tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tasks (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(100) NOT NULL,
    owner character varying(100) NOT NULL,
    labels bigint[],
    assignees text[],
    due_date character varying(15),
    due_time character varying(10),
    duration integer,
    end_time timestamp without time zone,
    google_calendar_event_id character varying(255),
    recurrence_rule character varying(255),
    reminder_before_task integer,
    reminder_date character varying(15),
    reminder_date_time timestamp without time zone,
    reminder_time character varying(10),
    start_time timestamp without time zone,
    timezone character varying(255) NOT NULL,
    completed_slots text,
    project_id bigint NOT NULL
);


ALTER TABLE public.tasks OWNER TO postgres;

--
-- Name: transaction_content_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_content_sequence
    START WITH 200
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_content_sequence OWNER TO postgres;

--
-- Name: transaction_contents; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transaction_contents (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    base_text text,
    owner character varying(100) NOT NULL,
    revisions text,
    text text,
    transaction_id bigint NOT NULL
);


ALTER TABLE public.transaction_contents OWNER TO postgres;

--
-- Name: transaction_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.transaction_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.transaction_sequence OWNER TO postgres;

--
-- Name: transactions; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.transactions (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(100) NOT NULL,
    owner character varying(100) NOT NULL,
    labels bigint[],
    amount double precision NOT NULL,
    date character varying(255) NOT NULL,
    end_time timestamp without time zone NOT NULL,
    payer character varying(100),
    start_time timestamp without time zone NOT NULL,
    "time" character varying(255),
    timezone character varying(50) NOT NULL,
    transaction_type integer NOT NULL,
    project_id bigint NOT NULL
);


ALTER TABLE public.transactions OWNER TO postgres;

--
-- Name: user_groups; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_groups (
    group_id bigint NOT NULL,
    user_id bigint NOT NULL,
    accepted boolean NOT NULL
);


ALTER TABLE public.user_groups OWNER TO postgres;

--
-- Name: user_project_notes; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_project_notes (
    project_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    notes character varying(10485760)
);


ALTER TABLE public.user_project_notes OWNER TO postgres;

--
-- Name: user_project_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_project_tasks (
    project_id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    tasks character varying(10485760)
);


ALTER TABLE public.user_project_tasks OWNER TO postgres;

--
-- Name: user_projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.user_projects (
    owner character varying(255) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    owned_projects character varying(10485760),
    shared_projects character varying(10485760)
);


ALTER TABLE public.user_projects OWNER TO postgres;

--
-- Name: user_sequence; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.user_sequence
    START WITH 100
    INCREMENT BY 50
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.user_sequence OWNER TO postgres;

--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    name character varying(100) NOT NULL,
    currency character varying(3),
    date_format integer NOT NULL,
    language character varying(25),
    reminder_before_task integer,
    theme character varying(255),
    time_format integer NOT NULL,
    timezone character varying(50) NOT NULL,
    shared_notes_project bigint,
    shared_tasks_project bigint,
    shared_transactions_project bigint
);


ALTER TABLE public.users OWNER TO postgres;
