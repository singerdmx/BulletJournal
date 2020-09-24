UPDATE template.steps
SET next_step = 11
WHERE id = 10;

INSERT INTO template.steps (id, created_at, updated_at, name, excluded_selections, next_step, choice_order)
VALUES (11, '2020-09-19 10:40:26.000000', '2020-09-19 10:40:29.000000', 'computer science final step', null, null, null);