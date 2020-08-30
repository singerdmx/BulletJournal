INSERT INTO template.choices (id, created_at, updated_at, multiple, name)
VALUES (16, '2020-08-30 19:59:23.000000', '2020-08-30 19:59:27.000000', true, 'Muscle Gain');

INSERT INTO template.choices (id, created_at, updated_at, multiple, name)
VALUES (17, '2020-08-30 19:59:23.000000', '2020-08-30 19:59:27.000000', true, 'Fat Burn');

INSERT INTO template.selections (id, created_at, updated_at, icon, text, choice_id)
VALUES (247, '2020-08-30 20:08:22.000000', '2020-08-30 20:08:25.000000', 'MehOutlined', 'Cardio', 17);

INSERT INTO template.selections (id, created_at, updated_at, icon, text, choice_id)
VALUES (248, '2020-08-30 20:08:22.000000', '2020-08-30 20:08:25.000000', 'MehOutlined', 'Chest', 16);

INSERT INTO template.choices_categories (choice_id, category_id)
VALUES (16, 11);

INSERT INTO template.choices_categories (choice_id, category_id)
VALUES (17, 11);