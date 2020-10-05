alter table template.sample_tasks
	add refreshable boolean default false;

UPDATE template.sample_tasks
SET refreshable = true
WHERE id = 5003;

UPDATE template.sample_tasks
SET refreshable = true
WHERE id = 5002;

UPDATE template.sample_tasks
SET refreshable = true
WHERE id = 5001;

UPDATE template.sample_tasks
SET refreshable = true
WHERE id = 5000;

UPDATE template.sample_tasks
SET content = '{"delta":{"ops":[{"insert":"Snowflake (SNOW) goes public on 2020-09-21\n"}]},"mdelta":[{"insert":"Snowflake (SNOW) goes public on 2020-09-21\n"}],"###html###":"<p>Snowflake (SNOW) goes public on 2020-09-21</p>"}'
WHERE id = 5003;

UPDATE template.sample_tasks
SET content = '{"delta":{"ops":[{"insert":"Snowflake (SNOW) goes public on 2020-09-21\n"}]},"mdelta":[{"insert":"Snowflake (SNOW) goes public on 2020-09-21\n"}],"###html###":"<p>Snowflake (SNOW) goes public on 2020-09-21</p>"}'
WHERE id = 5002;

UPDATE template.sample_tasks
SET content = '{"delta":{"ops":[{"insert":"Snowflake (SNOW) goes public on 2020-09-21\n"}]},"mdelta":[{"insert":"Snowflake (SNOW) goes public on 2020-09-21\n"}],"###html###":"<p>Snowflake (SNOW) goes public on 2020-09-21</p>"}'
WHERE id = 5001;

UPDATE template.sample_tasks
SET content = '{"delta":{"ops":[{"insert":"Snowflake (SNOW) goes public on 2020-09-21\n"}]},"mdelta":[{"insert":"Snowflake (SNOW) goes public on 2020-09-21\n"}],"###html###":"<p>Snowflake (SNOW) goes public on 2020-09-21</p>"}'
WHERE id = 5000;

