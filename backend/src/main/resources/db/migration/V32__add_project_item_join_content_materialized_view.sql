-- create content materialize view
create materialized view IF NOT exists tasks_join_task_contents as
SELECT a.id, max(b.updated_at) as most_recent_time, a.project_id FROM tasks a
RIGHT JOIN task_contents b ON a.id = b.task_id
GROUP BY a.id;

create materialized view IF NOT exists transactions_join_transaction_contents as
SELECT a.id, max(b.updated_at) as most_recent_time, a.project_id FROM transactions a
RIGHT JOIN transaction_contents b ON a.id = b.transaction_id
GROUP BY a.id;

create materialized view IF NOT exists notes_join_note_contents as
SELECT a.id, max(b.updated_at) as most_recent_time, a.project_id FROM notes a
RIGHT JOIN note_contents b ON a.id = b.note_id
GROUP BY a.id;

-- create index on id to enable concurrent update
CREATE UNIQUE INDEX tasks_join_task_contents_id_idx ON tasks_join_task_contents (id);

CREATE UNIQUE INDEX transactions_join_transaction_contents_id_idx ON transactions_join_transaction_contents (id);

CREATE UNIQUE INDEX notes_join_note_contents_id_idx ON notes_join_note_contents (id);

-- create refresh function
create or replace function refresh_tasks_join_task_contents()
    returns trigger
    language plpgsql
as
$$
begin
    refresh materialized view CONCURRENTLY tasks_join_task_contents;
    return null;
end
$$;

create or replace function refresh_transactions_join_transaction_contents()
    returns trigger
    language plpgsql
as
$$
begin
    refresh materialized view CONCURRENTLY transactions_join_transaction_contents;
    return null;
end
$$;

create or replace function refresh_notes_join_note_contents()
    returns trigger
    language plpgsql
as
$$
begin
    refresh materialized view CONCURRENTLY notes_join_note_contents;
    return null;
end
$$;

--create trigger
CREATE TRIGGER refresh_tasks_join_task_contents
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON tasks
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_tasks_join_task_contents();

CREATE TRIGGER refresh_transactions_join_transaction_contents
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON transactions
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_transactions_join_transaction_contents();

CREATE TRIGGER refresh_notes_join_note_contents
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON notes
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_notes_join_note_contents();

CREATE TRIGGER refresh_tasks_join_task_contents
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON task_contents
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_tasks_join_task_contents();

CREATE TRIGGER refresh_transactions_join_transaction_contents
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON transaction_contents
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_transactions_join_transaction_contents();

CREATE TRIGGER refresh_notes_join_note_contents
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON note_contents
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_notes_join_note_contents();
