create table if not exists template.step_metadata_keywords
(
    keyword varchar(500) not null
        constraint step_metadata_keywords_pkey
            primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    step_id bigint not null
        constraint step_metadata_keywords_step_id_foreign_key
            references template.steps
            on delete cascade
);

alter table template.step_metadata_keywords owner to postgres;

create index step_metadata_keywords_step_id_index
    on template.step_metadata_keywords (step_id);

INSERT INTO template.step_metadata_keywords (keyword, created_at, updated_at, step_id)
VALUES
       ('INVESTMENT_IPO_RECORD', '2020-09-27 14:49:43.000000', '2020-09-27 14:49:44.000000', 14),
       ('INVESTMENT_EARNINGS_RECORD', '2020-09-27 14:49:43.000000', '2020-09-27 14:49:44.000000', 16),
       ('INVESTMENT_DIVIDENDS_RECORD', '2020-09-27 14:49:43.000000', '2020-09-27 14:49:44.000000', 15);