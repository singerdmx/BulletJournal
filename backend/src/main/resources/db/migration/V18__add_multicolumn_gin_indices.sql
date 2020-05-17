CREATE EXTENSION IF NOT EXISTS BTREE_GIN;
-- tasks
CREATE INDEX tasks_assignees_project_id_index ON public.tasks USING GIN (assignees, project_id);
CREATE INDEX tasks_assignees_recurrence_rule_index ON public.tasks USING GIN (assignees, recurrence_rule);
CREATE INDEX tasks_assignees_start_time_reminder_date_time_index ON public.tasks USING GIN (assignees, start_time, reminder_date_time);
CREATE INDEX tasks_assignees_start_time_end_time_index ON public.tasks USING GIN (assignees, start_time, end_time);
CREATE INDEX tasks_labels_project_id_index ON public.tasks USING GIN (labels, project_id);
DROP INDEX task_assignee_interval_index;
DROP INDEX task_assignee_recurrence_index;
DROP INDEX task_assignee_reminder_date_time_index;
-- transactions
CREATE INDEX transactions_labels_project_id_index ON public.transactions USING GIN (labels, project_id);
-- notes
CREATE INDEX notes_labels_project_id_index ON public.notes USING GIN (labels, project_id);