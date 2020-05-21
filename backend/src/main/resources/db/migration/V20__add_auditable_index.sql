create index auditables_originator_index
    on auditables (originator);

create index auditables_action_index
    on auditables (action);