alter table template.sample_tasks
    add pending bool default false;

INSERT INTO template.users_categories (user_id, category_id, selections, project_id, metadata_keyword)
    VALUES (0, 13, '11,52,247,261,300,1000', 11, 'LEETCODE_ALGORITHM');

INSERT INTO template.users_categories (user_id, category_id, selections, project_id, metadata_keyword)
VALUES (0, 13, '11,56', 11, 'LEETCODE_DATABASE');