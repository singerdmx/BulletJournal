ALTER TABLE public.users
    ADD COLUMN email character varying(100) UNIQUE;