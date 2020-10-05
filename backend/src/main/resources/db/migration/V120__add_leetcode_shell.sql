INSERT INTO "template".sample_tasks (id,created_at,updated_at,metadata,content,name,uid) VALUES (192,'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593','LEETCODE_SHELL,Medium','{"delta":{"ops":[{"attributes":{"bold":true},"insert":"Medium"},{"insert":"Link: "},{"attributes":{"link":"https://leetcode.com/problems/word-frequency/"},"insert":"https://leetcode.com/problems/word-frequency/"},{"insert":"\n"}]},"###html###":"<p><strong>Medium</strong></p><p>Link: <a href=\"https://leetcode.com/problems/word-frequency/\" rel=\"noopener noreferrer\" target=\"_blank\">https://leetcode.com/problems/word-frequency/</a></p>"}','192 Word Frequency','192');
INSERT INTO "template".sample_tasks (id,created_at,updated_at,metadata,content,name,uid) VALUES (193,'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593','LEETCODE_SHELL,Easy','{"delta":{"ops":[{"attributes":{"bold":true},"insert":"Easy"},{"insert":"Link: "},{"attributes":{"link":"https://leetcode.com/problems/valid-phone-numbers/"},"insert":"https://leetcode.com/problems/valid-phone-numbers/"},{"insert":"\n"}]},"###html###":"<p><strong>Easy</strong></p><p>Link: <a href=\"https://leetcode.com/problems/valid-phone-numbers/\" rel=\"noopener noreferrer\" target=\"_blank\">https://leetcode.com/problems/valid-phone-numbers/</a></p>"}','193 Valid Phone Numbers','193');
INSERT INTO "template".sample_tasks (id,created_at,updated_at,metadata,content,name,uid) VALUES (194,'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593','LEETCODE_SHELL,Medium','{"delta":{"ops":[{"attributes":{"bold":true},"insert":"Medium"},{"insert":"Link: "},{"attributes":{"link":"https://leetcode.com/problems/transpose-file/"},"insert":"https://leetcode.com/problems/transpose-file/"},{"insert":"\n"}]},"###html###":"<p><strong>Medium</strong></p><p>Link: <a href=\"https://leetcode.com/problems/transpose-file/\" rel=\"noopener noreferrer\" target=\"_blank\">https://leetcode.com/problems/transpose-file/</a></p>"}','194 Transpose File','194');
INSERT INTO "template".sample_tasks (id,created_at,updated_at,metadata,content,name,uid) VALUES (195,'2020-08-29 10:21:46.593','2020-08-29 10:21:46.593','LEETCODE_SHELL,Easy','{"delta":{"ops":[{"attributes":{"bold":true},"insert":"Easy"},{"insert":"Link: "},{"attributes":{"link":"https://leetcode.com/problems/tenth-line/"},"insert":"https://leetcode.com/problems/tenth-line/"},{"insert":"\n"}]},"###html###":"<p><strong>Easy</strong></p><p>Link: <a href=\"https://leetcode.com/problems/tenth-line/\" rel=\"noopener noreferrer\" target=\"_blank\">https://leetcode.com/problems/tenth-line/</a></p>"}','195 Tenth Line','195');

INSERT INTO template.sample_task_rules (task_ids, step_id, selection_combo) VALUES ('175,176,181,182,183,196,197,511,512,577,584,586,595,596,597,603,607,610,613,619,620,627,1050,1068,1069,1075,1076,1082,1083,1084,1113,1141,1142,1148,1173,1179,1211,1241,1251,1280,1294,1303,1322,1327,1350,1378,1407,1435,1484,1495,1511,1517,1527,1543,1565,1571,1581,1587', 13, '11');
INSERT INTO template.sample_task_rules (task_ids, step_id, selection_combo) VALUES ('177,178,180,184,534,550,570,574,578,580,585,602,608,612,614,626,1045,1070,1077,1098,1107,1112,1126,1132,1149,1158,1164,1174,1193,1204,1205,1212,1264,1270,1285,1308,1321,1341,1355,1364,1393,1398,1421,1440,1445,1454,1459,1468,1501,1532,1549,1555,1596', 13, '13');
INSERT INTO template.sample_task_rules (task_ids, step_id, selection_combo) VALUES ('185,262,569,571,579,601,615,618,1097,1127,1159,1194,1225,1336,1369,1384,1412,1479', 13, '15');

INSERT INTO template.choices_steps (choice_id, step_id)
VALUES (11, 17);

INSERT INTO template.sample_task_rules (task_ids, step_id, selection_combo) VALUES ('193,195', 18, '11');
INSERT INTO template.sample_task_rules (task_ids, step_id, selection_combo) VALUES ('192,194', 18, '13');

INSERT INTO template.category_rules (id, name, created_at, updated_at, rule_expression, priority, category_id,
                                     connected_step_id)
VALUES (12, 'CS shell rule', '2020-10-04 16:09:16.000000', '2020-10-04 16:09:17.000000',
        '{"rule":[{"condition":"CONTAINS","selectionIds":[57]}],"logicOperator":AND}', 0, 13, 17);

UPDATE template.steps
SET excluded_selections = '{15}'
WHERE id = 17;