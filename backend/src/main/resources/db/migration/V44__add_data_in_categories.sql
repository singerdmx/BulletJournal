INSERT INTO template.categories VALUES (13, 'Computer Science', null, current_timestamp,
                                        current_timestamp, 'LaptopOutlined', '#ff9980');

UPDATE template.categories_hierarchy
SET hierarchy = '[{"id":10,"s":[{"id":13,"s":[]}]},{"id":11,"s":[]},{"id":12,"s":[]}]'
WHERE onerow_id = 1;