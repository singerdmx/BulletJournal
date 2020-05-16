package com.bulletjournal.notifications;

import com.bulletjournal.repository.AuditableDaoJpa;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

public class MockedAuditableDaoJpa extends AuditableDaoJpa {

    private List<com.bulletjournal.repository.models.Auditable> auditables =
            Collections.synchronizedList(new ArrayList<>());

    @Override
    public synchronized void create(List<Auditable> activities) {
        activities.forEach(auditable -> this.auditables.add(auditable.toRepositoryAuditable()));
    }
}
