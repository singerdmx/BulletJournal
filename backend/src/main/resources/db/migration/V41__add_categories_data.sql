alter table template.categories alter column description drop not null;
INSERT INTO template.categories VALUES (10, 'Job Hunting', null, current_timestamp, current_timestamp);
INSERT INTO template.categories VALUES (11, 'Fitness', null, current_timestamp, current_timestamp);
INSERT INTO template.categories VALUES (12, 'Trip Planning', null, current_timestamp, current_timestamp);