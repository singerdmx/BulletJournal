UPDATE template.choices
SET name = 'Data Structure and Algorithms Topics'
WHERE id = 15;
create table if not exists template.choices_categories (
    choice_id bigint NOT NULL,
    category_id bigint NOT NULL
);
INSERT INTO template.choices_categories (choice_id, category_id)
VALUES (11, 13);

INSERT INTO template.choices_categories (choice_id, category_id)
VALUES (13, 13);

INSERT INTO template.choices_categories (choice_id, category_id)
VALUES (10, 13);