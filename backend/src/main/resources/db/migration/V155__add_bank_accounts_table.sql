CREATE SEQUENCE public.bank_accounts_sequence
    START WITH 100
    INCREMENT BY 2
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

CREATE TABLE public.bank_accounts (
    id bigint PRIMARY KEY,
    owner varchar(100),
    name varchar(500),
    account_number integer,
    description varchar(600),
    -- CHECKING_ACCOUNT SAVING_ACCOUNT CREDIT_CARD
    account_type varchar(100),
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    net_balance double precision
);

ALTER TABLE public.bank_accounts OWNER TO postgres;

CREATE INDEX bank_accounts_owner_index ON public.bank_accounts USING btree(owner);