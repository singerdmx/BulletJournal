INSERT INTO template.categories (id, name, description, created_at, updated_at, icon, color, forum_id, image)
VALUES (14, 'Data Science', null, '2020-08-26 20:52:16.000000', '2020-08-26 20:52:18.000000', 'DatabaseOutlined',
        '#cc80ff', null, null);

UPDATE template.categories_hierarchy
SET hierarchy = '[{"id":10,"s":[{"id":13,"s":[]},{"id":14,"s":[]}]},{"id":11,"s":[]},{"id":12,"s":[]}]'
WHERE onerow_id = 1;