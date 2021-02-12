CREATE SEQUENCE public.bank_account_transactions_sequence
    START WITH 100
    INCREMENT BY 2
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER TABLE public.bank_account_transactions_sequence OWNER TO postgres;

CREATE TABLE public.bank_account_transactions (
    id bigint PRIMARY KEY,
    amount double precision not null,
    name varchar(100) not null,
    created_at timestamp without time zone NOT NULL,
    updated_at timestamp without time zone NOT NULL,
    bank_account bigint not null
        constraint bank_account_transactions__bank_accounts_fk
            references bank_accounts
            on delete cascade
);

ALTER TABLE public.bank_account_transactions OWNER TO postgres;