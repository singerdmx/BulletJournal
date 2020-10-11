INSERT INTO template.selections (id, created_at, updated_at, icon, text, choice_id, page)
VALUES (537, '2020-10-10 22:12:50.000000', '2020-10-10 22:12:48.000000', null, 'peak6', 13, null);

DELETE
FROM template.selections
WHERE id = 495;

DELETE
FROM template.selections
WHERE id = 489;

DELETE
FROM template.sample_task_rules
WHERE step_id = 11
  AND selection_combo = '264,495';

DELETE
FROM template.sample_task_rules
WHERE step_id = 11
  AND selection_combo = '263,495';

DELETE
FROM template.sample_task_rules
WHERE step_id = 11
  AND selection_combo = '264,489';

DELETE
FROM template.sample_task_rules
WHERE step_id = 11
  AND selection_combo = '263,489';
