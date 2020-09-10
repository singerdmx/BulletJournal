alter table template.category_rules add CONSTRAINT category_rules_foreign_key FOREIGN KEY (connected_step_id) REFERENCES template.steps(id) ON DELETE CASCADE;

alter table template.step_rules add CONSTRAINT step_rules_foreign_key FOREIGN KEY (connected_step_id) REFERENCES template.steps(id) ON DELETE CASCADE;