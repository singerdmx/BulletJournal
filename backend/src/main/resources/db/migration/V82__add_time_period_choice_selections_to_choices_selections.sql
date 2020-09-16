INSERT INTO "template".choices (id,created_at,updated_at,multiple,"name") VALUES
(19,'2020-09-16 19:56:08.900','2020-09-16 19:56:08.900',false,'Time Period');

INSERT INTO "template".selections (id,created_at,updated_at,icon,"text",choice_id,page) VALUES
(261,'2020-09-16 19:56:08.900','2020-09-16 19:56:08.900',NULL,'6 months',19,NULL)
,(262,'2020-09-16 19:56:08.900','2020-09-16 19:56:08.900',NULL,'1 year',19,NULL)
,(263,'2020-09-16 19:56:08.900','2020-09-16 19:56:08.900',NULL,'2 years',19,NULL)
,(264,'2020-09-16 19:56:08.900','2020-09-16 19:56:08.900',NULL,'All time',19,NULL);

INSERT INTO "template".choices_steps (choice_id,step_id) VALUES (19,10);