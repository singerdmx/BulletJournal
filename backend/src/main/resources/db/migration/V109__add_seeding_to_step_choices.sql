INSERT INTO template.choices_steps (choice_id, step_id)
VALUES (11, 12);

UPDATE template.category_rules
SET name = 'CS Data Structure'
WHERE id = 10;

INSERT INTO template.category_rules (id, name, created_at, updated_at, rule_expression, priority, category_id, connected_step_id)
    VALUES (11, 'CS database rule', '2020-09-29 16:17:23.203000', '2020-09-29 16:17:23.203000', '{"rule":[{"condition":"CONTAINS","selectionIds":[56]}],"logicOperator":AND}', 0, 13, 12);

UPDATE template.steps
SET name = 'leetcode database final step'
WHERE id = 13;
