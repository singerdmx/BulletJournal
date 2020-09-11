INSERT INTO "template".choices (id,created_at,updated_at,multiple,"name") VALUES
(17,'2020-09-10 16:38:02.641','2020-09-10 16:38:02.641',false,'Intensity')
;
------------------------------------------------
INSERT INTO "template".selections (id,created_at,updated_at,icon,"text",choice_id,page) VALUES
(247,'2020-09-10 16:31:36.923','2020-09-10 16:31:36.923',NULL,'Low',17,NULL)
,(248,'2020-09-10 16:31:36.923','2020-09-10 16:31:36.923',NULL,'Medium',17,NULL)
,(249,'2020-09-10 16:31:36.923','2020-09-10 16:31:36.923',NULL,'High',17,NULL)
;
------------------------------------------------
INSERT INTO "template".choices_categories (choice_id,category_id) VALUES
(17,13)
;