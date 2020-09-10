alter table template.category_rules add step_id bigint;

UPDATE template.choices
SET multiple = false
WHERE id = 10;

INSERT INTO "template".steps
(id, created_at, updated_at, "name", excluded_selections, next_step)
VALUES(10, '2020-09-09 21:52:59.404', '2020-09-09 21:52:59.404', 'computer science first step', null, null);

INSERT INTO "template".choices_steps
(choice_id, step_id)
VALUES(11, 10);

INSERT INTO "template".choices_steps
(choice_id, step_id)
VALUES(13, 10);

INSERT INTO "template".choices_steps
(choice_id, step_id)
VALUES(15, 10);

INSERT INTO "template".category_rules
(id, "name", created_at, updated_at, rule_expression, priority, category_id, step_id)
VALUES(10, 'computer science category rule', '2020-09-09 21:52:59.404', '2020-09-09 21:52:59.404', '{"rule":[{"choiceId":10,"condition":"EXACT","selectionIds":[52]}],"logicOperator":null}', null, 13, 10);