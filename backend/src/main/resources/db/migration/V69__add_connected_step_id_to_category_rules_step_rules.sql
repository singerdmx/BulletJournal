alter table template.category_rules rename column step_id to connected_step_id;

alter table template.step_rules add connected_step_id bigint;
