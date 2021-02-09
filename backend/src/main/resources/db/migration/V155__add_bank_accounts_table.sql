CREATE SEQUENCE public.bank_account_sequence
    START WITH 100
    INCREMENT BY 2
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.bank_account_sequence OWNER TO postgres;

CREATE TABLE public.bank_accounts (
    id bigint PRIMARY KEY,
    owner varchar(100) NOT NULL,
    name varchar(100) NOT NULL,
    account_number integer,
    description varchar(600),
--     CHECKING_ACCOUNT SAVING_ACCOUNT CREDIT_CARD
    account_type varchar(100) NOT NULL,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    net_balance double precision default 0 NOT NULL
);

ALTER TABLE public.bank_accounts OWNER TO postgres;

CREATE INDEX bank_accounts_owner_index ON public.bank_accounts USING btree(owner);

alter table transactions
    add bank_account bigint;

alter table transactions
    add constraint transactions__bank_accounts_fk
        foreign key (bank_account) references bank_accounts (id)
            on delete cascade;