ALTER TABLE template.categories ADD column need_start_date boolean not null DEFAULT false;

update template.categories set need_start_date=true where id=13;