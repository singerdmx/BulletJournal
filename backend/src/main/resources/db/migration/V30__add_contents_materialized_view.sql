-- create content materialize view
create materialized view IF NOT exists task_contents_matview as
select task_contents.id,
       task_contents.text                           as value,
       task_contents.task_id                        as parent_id,
       task_contents.updated_at,
       tasks.project_id,
       extract(epoch from task_contents.updated_at) as unix_ts_in_secs
from task_contents
         left join tasks on
    task_contents.task_id = tasks.id;

create materialized view IF NOT exists note_contents_matview as
select note_contents.id,
       note_contents.text                           as value,
       note_contents.note_id                        as parent_id,
       note_contents.updated_at,
       notes.project_id,
       extract(epoch from note_contents.updated_at) as unix_ts_in_secs
from note_contents
         left join notes on
    note_contents.note_id = notes.id;

create materialized view IF NOT exists transaction_contents_matview as
select transaction_contents.id,
       transaction_contents.text                           as value,
       transaction_contents.transaction_id                 as parent_id,
       transaction_contents.updated_at,
       transactions.project_id,
       extract(epoch from transaction_contents.updated_at) as unix_ts_in_secs
from transaction_contents
         left join transactions on
    transaction_contents.transaction_id = transactions.id;

-- create index on id to enable concurrent update
CREATE UNIQUE INDEX task_contents_matview_id_idx ON task_contents_matview (id);

CREATE UNIQUE INDEX note_contents_matview_id_idx ON note_contents_matview (id);

CREATE UNIQUE INDEX transaction_contents_matview_id_idx ON transaction_contents_matview (id);

-- create refresh function
create or replace function refresh_task_contents_matview()
    returns trigger
    language plpgsql
as
$$
begin
    refresh materialized view CONCURRENTLY task_contents_matview;
    return null;
end
$$;

create or replace function refresh_transaction_contents_matview()
    returns trigger
    language plpgsql
as
$$
begin
    refresh materialized view CONCURRENTLY transaction_contents_matview;
    return null;
end
$$;

create or replace function refresh_note_contents_matview()
    returns trigger
    language plpgsql
as
$$
begin
    refresh materialized view CONCURRENTLY note_contents_matview;
    return null;
end
$$;

--create trigger
CREATE TRIGGER refresh_note_contents_matview
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON note_contents
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_note_contents_matview();

CREATE TRIGGER refresh_task_contents_matview
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON task_contents
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_task_contents_matview();

CREATE TRIGGER refresh_transaction_contents_matview
    AFTER INSERT OR UPDATE OR DELETE OR TRUNCATE
    ON transaction_contents
    FOR EACH STATEMENT
EXECUTE PROCEDURE refresh_transaction_contents_matview();

