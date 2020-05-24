package com.bulletjournal.repository;

import com.bulletjournal.repository.models.GoogleCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.Set;

@Repository
public interface GoogleCredentialRepository extends JpaRepository<GoogleCredential, String> {
    Optional<GoogleCredential> findByKey(String key);

    Optional<GoogleCredential> findByAccessToken(String key);

    @Query(value = "select key from google_credentials", nativeQuery = true)
    Set<String> findAllKeys();
}