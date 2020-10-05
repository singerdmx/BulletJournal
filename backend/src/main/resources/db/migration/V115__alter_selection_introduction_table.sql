alter table template.selection_introduction drop constraint selection_introduction_selection_id_fkey;

alter table template.selection_introduction
 add constraint selection_introduction_selection_id_fkey
  foreign key (selection_id) references template.selections
   on delete cascade;