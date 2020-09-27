create table if not exists template.selection_metadata_keywords
(
    keyword varchar(500) not null
        constraint selection_metadata_keywords_pkey
            primary key,
    created_at timestamp not null,
    updated_at timestamp not null,
    selection_id bigint not null
        constraint selection_metadata_keywords_selection_id_foreign_key
            references template.selections
            on delete cascade
);

alter table template.selection_metadata_keywords owner to postgres;

create index selection_metadata_keywords_selection_id_index
    on template.selection_metadata_keywords (selection_id);

INSERT INTO template.selection_metadata_keywords (keyword, created_at, updated_at, selection_id)
VALUES ('LEETCODE_ALGORITHM', '2020-09-27 11:54:33.000000', '2020-09-27 11:54:35.000000', 52);