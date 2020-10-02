INSERT INTO template.selection_metadata_keywords (keyword, created_at, updated_at, selection_id)
    VALUES
           ('INVESTMENT_CONSUMER_DISCRETIONARY', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 251),
           ('INVESTMENT_CONSUMER_STAPLES', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 252),
           ('INVESTMENT_ENERGY', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 253),
           ('INVESTMENT_FINANCIALS', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 254),
           ('INVESTMENT_HEALTH_CARE', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 255),
           ('INVESTMENT_INDUSTRIALS', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 256),
           ('INVESTMENT_INFORMATION_TECHNOLOGY', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 257),
           ('INVESTMENT_MATERIALS', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 258),
           ('INVESTMENT_REAL_ESTATE', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 259),
           ('INVESTMENT_UTILITIES', '2020-09-28 21:44:36.000000', '2020-09-28 21:44:38.000000', 260);

INSERT INTO template.steps (id, created_at, updated_at, name, excluded_selections, next_step, choice_order)
VALUES (13, '2020-09-28 21:57:23.000000', '2020-09-28 21:57:25.000000', 'leetcode algorithms final step', null, null,
        null);

INSERT INTO template.steps (id, created_at, updated_at, name, excluded_selections, next_step, choice_order)
VALUES (12, '2020-09-28 21:56:14.000000', '2020-09-28 21:56:15.000000', 'leetcode database first step', null, 13, null);

INSERT INTO template.steps (id, created_at, updated_at, name, excluded_selections, next_step, choice_order)
VALUES (14, '2020-09-28 21:58:26.000000', '2020-09-28 21:58:28.000000', 'investment ipos final step', null, null, null);

INSERT INTO template.steps (id, created_at, updated_at, name, excluded_selections, next_step, choice_order)
VALUES (15, '2020-09-28 21:59:03.000000', '2020-09-28 21:59:05.000000', 'investment dividend final step', null, null,
        null);

INSERT INTO template.steps (id, created_at, updated_at, name, excluded_selections, next_step, choice_order)
VALUES (16, '2020-09-28 21:59:23.000000', '2020-09-28 21:59:25.000000', 'investment earnings final step', null, null,
        null);