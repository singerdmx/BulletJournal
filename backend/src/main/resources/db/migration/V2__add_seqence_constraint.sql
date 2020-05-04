--
-- Name: calendar_token_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.calendar_token_sequence', 300, false);


--
-- Name: completed_task_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.completed_task_sequence', 300, false);


--
-- Name: group_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.group_sequence', 350, true);


--
-- Name: label_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.label_sequence', 350, true);


--
-- Name: note_content_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.note_content_sequence', 550, true);


--
-- Name: note_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.note_sequence', 550, true);


--
-- Name: notification_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notification_sequence', 600, true);


--
-- Name: project_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.project_sequence', 350, true);


--
-- Name: shared_project_item_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.shared_project_item_sequence', 350, true);


--
-- Name: task_content_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_content_sequence', 550, true);


--
-- Name: task_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.task_sequence', 350, true);


--
-- Name: transaction_content_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_content_sequence', 500, false);


--
-- Name: transaction_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transaction_sequence', 300, false);


--
-- Name: user_sequence; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_sequence', 350, true);


--
-- Name: calendar_tokens calendar_tokens_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.calendar_tokens
    ADD CONSTRAINT calendar_tokens_pkey PRIMARY KEY (id);


--
-- Name: completed_tasks completed_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT completed_tasks_pkey PRIMARY KEY (id);


--
-- Name: google_calendar_projects google_calendar_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.google_calendar_projects
    ADD CONSTRAINT google_calendar_projects_pkey PRIMARY KEY (id);


--
-- Name: google_credentials google_credentials_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.google_credentials
    ADD CONSTRAINT google_credentials_pkey PRIMARY KEY (key);


--
-- Name: groups groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT groups_pkey PRIMARY KEY (id);


--
-- Name: labels labels_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT labels_pkey PRIMARY KEY (id);


--
-- Name: note_contents note_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_contents
    ADD CONSTRAINT note_contents_pkey PRIMARY KEY (id);


--
-- Name: notes notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT notes_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (id);


--
-- Name: public_project_items public_project_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.public_project_items
    ADD CONSTRAINT public_project_items_pkey PRIMARY KEY (id);


--
-- Name: shared_project_items shared_project_items_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shared_project_items
    ADD CONSTRAINT shared_project_items_pkey PRIMARY KEY (id);


--
-- Name: task_contents task_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_contents
    ADD CONSTRAINT task_contents_pkey PRIMARY KEY (id);


--
-- Name: tasks tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT tasks_pkey PRIMARY KEY (id);


--
-- Name: transaction_contents transaction_contents_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_contents
    ADD CONSTRAINT transaction_contents_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: users uk3g1j96g94xpk3lpxl2qbl985x; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk3g1j96g94xpk3lpxl2qbl985x UNIQUE (name);


--
-- Name: projects uk42aer8go91vaffftcr24m5ts3; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT uk42aer8go91vaffftcr24m5ts3 UNIQUE (owner, name);


--
-- Name: groups ukf75dl7krspgd7fi41uw21b7qo; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.groups
    ADD CONSTRAINT ukf75dl7krspgd7fi41uw21b7qo UNIQUE (owner, name);


--
-- Name: tasks ukhy5bha0n17t15iodjdy2ymf1q; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT ukhy5bha0n17t15iodjdy2ymf1q UNIQUE (google_calendar_event_id);


--
-- Name: labels ukjjn4aht0kfqh9jdth1cml03kd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.labels
    ADD CONSTRAINT ukjjn4aht0kfqh9jdth1cml03kd UNIQUE (owner, name);


--
-- Name: google_calendar_projects ukll045rop31egbrwbqarrkjjvd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.google_calendar_projects
    ADD CONSTRAINT ukll045rop31egbrwbqarrkjjvd UNIQUE (channel_id);


--
-- Name: user_groups user_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT user_groups_pkey PRIMARY KEY (group_id, user_id);


--
-- Name: user_project_notes user_project_notes_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_project_notes
    ADD CONSTRAINT user_project_notes_pkey PRIMARY KEY (project_id);


--
-- Name: user_project_tasks user_project_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_project_tasks
    ADD CONSTRAINT user_project_tasks_pkey PRIMARY KEY (project_id);


--
-- Name: user_projects user_projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_projects
    ADD CONSTRAINT user_projects_pkey PRIMARY KEY (owner);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: calendar_token_owner_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX calendar_token_owner_index ON public.calendar_tokens USING btree (owner);


--
-- Name: completed_task_project_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX completed_task_project_id_index ON public.completed_tasks USING btree (project_id);


--
-- Name: group_name_owner_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX group_name_owner_index ON public.groups USING btree (name, owner);


--
-- Name: label_owner_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX label_owner_index ON public.labels USING btree (owner);


--
-- Name: label_owner_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX label_owner_name_index ON public.labels USING btree (owner, name);


--
-- Name: notification_stale_check_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_stale_check_index ON public.notifications USING btree (updated_at);


--
-- Name: notification_time_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX notification_time_index ON public.notifications USING btree (target_user, updated_at);


--
-- Name: project_owner_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX project_owner_index ON public.projects USING btree (owner);


--
-- Name: public_project_items_note_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX public_project_items_note_index ON public.public_project_items USING btree (note_id);


--
-- Name: public_project_items_task_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX public_project_items_task_index ON public.public_project_items USING btree (task_id);


--
-- Name: shared_project_items_note_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX shared_project_items_note_index ON public.shared_project_items USING btree (note_id);


--
-- Name: shared_project_items_task_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX shared_project_items_task_index ON public.shared_project_items USING btree (task_id);


--
-- Name: shared_project_items_username_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX shared_project_items_username_index ON public.shared_project_items USING btree (username);


--
-- Name: task_assignee_interval_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX task_assignee_interval_index ON public.tasks USING btree (start_time, end_time);


--
-- Name: task_assignee_recurrence_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX task_assignee_recurrence_index ON public.tasks USING btree (recurrence_rule);


--
-- Name: task_assignee_reminder_date_time_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX task_assignee_reminder_date_time_index ON public.tasks USING btree (start_time, reminder_date_time);


--
-- Name: task_project_id_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX task_project_id_index ON public.tasks USING btree (project_id);


--
-- Name: transaction_payer_interval_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transaction_payer_interval_index ON public.transactions USING btree (payer, start_time, end_time);


--
-- Name: transaction_project_interval_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX transaction_project_interval_index ON public.transactions USING btree (project_id, start_time, end_time);


--
-- Name: user_group_group_accept_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_group_group_accept_index ON public.user_groups USING btree (group_id, accepted);


--
-- Name: user_group_user_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_group_user_index ON public.user_groups USING btree (user_id);


--
-- Name: user_name_index; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX user_name_index ON public.users USING btree (name);


--
-- Name: shared_project_items fk1nch8j0wxi5pkl35wyk2aco6k; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shared_project_items
    ADD CONSTRAINT fk1nch8j0wxi5pkl35wyk2aco6k FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON DELETE CASCADE;


--
-- Name: transaction_contents fk39yhi95uwi6t3ti78f4wtniry; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transaction_contents
    ADD CONSTRAINT fk39yhi95uwi6t3ti78f4wtniry FOREIGN KEY (transaction_id) REFERENCES public.transactions(id) ON DELETE CASCADE;


--
-- Name: users fk3jxbbbx8grokq37okafb1x9c3; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk3jxbbbx8grokq37okafb1x9c3 FOREIGN KEY (shared_notes_project) REFERENCES public.projects(id);


--
-- Name: transactions fk4ip0ky0sey13ur3svrjdwvw79; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT fk4ip0ky0sey13ur3svrjdwvw79 FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: users fk71pkctpv2qpcbuey7or8xpqx8; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fk71pkctpv2qpcbuey7or8xpqx8 FOREIGN KEY (shared_tasks_project) REFERENCES public.projects(id);


--
-- Name: shared_project_items fk7ixbcwr5y8lmua0jvb3dio126; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shared_project_items
    ADD CONSTRAINT fk7ixbcwr5y8lmua0jvb3dio126 FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: user_groups fkd37bs5u9hvbwljup24b2hin2b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT fkd37bs5u9hvbwljup24b2hin2b FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: note_contents fkd4fhxn39k4uy3hvwrmaiwvqnf; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.note_contents
    ADD CONSTRAINT fkd4fhxn39k4uy3hvwrmaiwvqnf FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: notes fkf5kwkuxo55mgr2vkluhrh7tth; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.notes
    ADD CONSTRAINT fkf5kwkuxo55mgr2vkluhrh7tth FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: shared_project_items fkhhti2trtnbqu15vavp0eaenaa; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.shared_project_items
    ADD CONSTRAINT fkhhti2trtnbqu15vavp0eaenaa FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: users fkhupnh1bpqc4wcrn4mvfxteeye; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT fkhupnh1bpqc4wcrn4mvfxteeye FOREIGN KEY (shared_transactions_project) REFERENCES public.projects(id);


--
-- Name: google_calendar_projects fkjyhone8upbam25sqdwu3teg2; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.google_calendar_projects
    ADD CONSTRAINT fkjyhone8upbam25sqdwu3teg2 FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: projects fklk9q8cmfbp6pfg79n1aarcqrb; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT fklk9q8cmfbp6pfg79n1aarcqrb FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: user_groups fkmrgahbb4w32n9wkjqbipttc87; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.user_groups
    ADD CONSTRAINT fkmrgahbb4w32n9wkjqbipttc87 FOREIGN KEY (group_id) REFERENCES public.groups(id);


--
-- Name: public_project_items fkn6ro13nfbf6c4r5c92a59uif9; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.public_project_items
    ADD CONSTRAINT fkn6ro13nfbf6c4r5c92a59uif9 FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: completed_tasks fkniai4qx1ak1xmx6a12d98nt19; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.completed_tasks
    ADD CONSTRAINT fkniai4qx1ak1xmx6a12d98nt19 FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- Name: task_contents fkrfkpety80gl5nltwx9luqfp99; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task_contents
    ADD CONSTRAINT fkrfkpety80gl5nltwx9luqfp99 FOREIGN KEY (task_id) REFERENCES public.tasks(id) ON DELETE CASCADE;


--
-- Name: public_project_items fkrtjafsn43p3cmibfaffq0nm7s; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.public_project_items
    ADD CONSTRAINT fkrtjafsn43p3cmibfaffq0nm7s FOREIGN KEY (note_id) REFERENCES public.notes(id) ON DELETE CASCADE;


--
-- Name: tasks fksfhn82y57i3k9uxww1s007acc; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tasks
    ADD CONSTRAINT fksfhn82y57i3k9uxww1s007acc FOREIGN KEY (project_id) REFERENCES public.projects(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--
