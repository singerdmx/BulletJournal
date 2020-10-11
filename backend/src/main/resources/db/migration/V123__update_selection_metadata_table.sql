alter table template.selection_metadata_keywords
    add frequency int;

INSERT INTO template.selection_metadata_keywords (keyword, created_at, updated_at, selection_id, frequency)
VALUES ('INTENSITY_LOW', '2020-10-05 22:05:21.000000', '2020-10-05 22:05:24.000000', 247, 2);

INSERT INTO template.selection_metadata_keywords (keyword, created_at, updated_at, selection_id, frequency)
VALUES ('INTENSITY_MEDIUM', '2020-10-05 22:06:01.000000', '2020-10-05 22:06:03.000000', 248, 4);

INSERT INTO template.selection_metadata_keywords (keyword, created_at, updated_at, selection_id, frequency)
VALUES ('INTENSITY_HIGH', '2020-10-05 22:06:17.000000', '2020-10-05 22:06:18.000000', 249, 8);