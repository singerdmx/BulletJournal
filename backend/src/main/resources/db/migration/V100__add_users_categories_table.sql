create table if not exists template.users_categories (
    user_id bigint not null,
    category_id bigint not null,
    selections text
);