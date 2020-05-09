package com.bulletjournal.repository;

import com.bulletjournal.repository.models.UserAlias;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserAliasRepository extends JpaRepository<UserAlias, String> {
}
