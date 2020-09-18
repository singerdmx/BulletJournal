ALTER TABLE template.sample_tasks
    ADD column available_before timestamp without time zone NULL,
    ADD column reminder_before_task integer NULL;
