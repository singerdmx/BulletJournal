CREATE SEQUENCE if not exists "template".sample_task_rule_sequence
	INCREMENT BY 2
	MINVALUE 1
	MAXVALUE 9223372036854775807
	START 100
	CACHE 1
	NO CYCLE;

CREATE TABLE if not exists template.sample_task_rules (
    id bigint,
    name CHARACTER VARYING(100),
    connected_step_id bigint,
    created_at TIMESTAMP without TIME ZONE NOT NULL,
    updated_at TIMESTAMP without TIME ZONE NOT NULL,
    priority INTEGER,
    rule_expression text,

    task_ids text NOT NULL,
    step_id bigint NOT NULL REFERENCES template.steps,
    selection_combo VARCHAR(500) NOT NULL,
    PRIMARY KEY (step_id, selection_combo)
);

ALTER TABLE "template".sample_task_rules OWNER TO postgres;
GRANT ALL ON TABLE "template".sample_task_rules TO postgres;