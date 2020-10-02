alter table template.users_categories
    add metadata_keyword varchar(500) not null;

alter table template.users_categories
    add constraint users_categories_user_fk
        foreign key (user_id) references public.users(id)
            on delete cascade;

alter table template.users_categories
    add constraint users_categories_category_fk
        foreign key (category_id) references template.categories(id)
            on delete cascade;

alter table template.users_categories
    add constraint users_categories_metadata_keyword_fk
        foreign key (metadata_keyword) references template.selection_metadata_keywords(keyword)
            on delete cascade;

alter table template.users_categories
    add constraint users_categories_pk
        primary key (user_id, category_id, metadata_keyword);