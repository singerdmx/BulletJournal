package com.bulletjournal.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bulletjournal.repository.models.Question;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
}