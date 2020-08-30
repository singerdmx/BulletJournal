INSERT INTO template.categories VALUES (15, 'Fat Burn', null, current_timestamp,
                                        current_timestamp, 'SkinOutlined', '#ff9980',
                                        null, 'https://user-images.githubusercontent.com/24964756/91668644-17615b00-eac3-11ea-943e-81de6369e9b1.jpg');

INSERT INTO template.categories VALUES (16, 'Muscle Gain', null, current_timestamp,
                                        current_timestamp, 'UserAddOutlined', '#ff9980',
                                        null, 'https://user-images.githubusercontent.com/24964756/91668691-66a78b80-eac3-11ea-87f3-03a5c1adaf4e.jpg');


UPDATE template.categories_hierarchy
SET hierarchy = '[{"id":10,"s":[{"id":13,"s":[]}]},{"id":11,"s":[{"id":15,"s":[]},{"id":16,"s":[]}]},{"id":12,"s":[]}]'
WHERE onerow_id = 1;