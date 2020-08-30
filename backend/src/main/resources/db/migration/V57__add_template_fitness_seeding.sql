INSERT INTO template.categories VALUES (15, 'Fat Loss', null, current_timestamp,
                                        current_timestamp, 'LikeTwoTone', '#f1ccb8',
                                        null, 'https://user-images.githubusercontent.com/24964756/91668644-17615b00-eac3-11ea-943e-81de6369e9b1.jpg');

INSERT INTO template.categories VALUES (16, 'Muscle Gain', null, current_timestamp,
                                        current_timestamp, 'SkinTwoTone', '#f1f1b8',
                                        null, 'https://user-images.githubusercontent.com/122956/91668993-30b7d680-eac6-11ea-92ae-7121700baa9a.png');


UPDATE template.categories_hierarchy
SET hierarchy = '[{"id":10,"s":[{"id":13,"s":[]},{"id":14,"s":[]}]},{"id":11,"s":[{"id":15,"s":[]},{"id":16,"s":[]}]},{"id":12,"s":[]}]'
WHERE onerow_id = 1;