DROP TABLE template.steps_sample_tasks;

CREATE TABLE if not exists template.sample_task_rules (
    task_ids text NOT NULL,
    step_id bigint NOT NULL REFERENCES template.steps,
    selection_combo VARCHAR(500) NOT NULL,
    PRIMARY KEY (step_id, selection_combo)
);

ALTER TABLE "template".sample_task_rules OWNER TO postgres;
GRANT ALL ON TABLE "template".sample_task_rules TO postgres;