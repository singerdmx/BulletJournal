package com.bulletjournal.repository.factory;

import com.bulletjournal.repository.models.AuditModel;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface Etaggable {

    <T extends AuditModel> JpaRepository<T, Long> getJpaRepository();

    List<String> findAffectedUsers(String contentId);

    String getUserEtag(String username);
}

