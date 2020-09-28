create table if not exists template.choice_metadata_keywords
(
    keyword varchar(500) not null
        constraint choice_metadata_keywords_pkey
            primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    choice_id bigint not null
        constraint choice_metadata_keywords_choice_id_foreign_key
            references template.choices
            on delete cascade
);

alter table template.choice_metadata_keywords owner to postgres;

create index choice_metadata_keywords_choice_id_index
    on template.choice_metadata_keywords (choice_id);

INSERT INTO template.choice_metadata_keywords (keyword, created_at, updated_at, choice_id)
VALUES ('INVESTMENT', '2020-09-27 14:49:43.000000', '2020-09-27 14:49:44.000000', 18);

INSERT INTO template.selection_metadata_keywords (keyword, created_at, updated_at, selection_id)
VALUES ('INVESTMENT_COMMUNICATION_SERVICES', '2020-09-27 14:54:48.000000', '2020-09-27 14:54:50.000000', 250);
