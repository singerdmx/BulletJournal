package com.bulletjournal.controller;

import com.bulletjournal.config.AuthConfig;
import com.bulletjournal.exception.ResourceNotFoundException;
import com.bulletjournal.repository.QuestionRepository;
import com.bulletjournal.repository.model.Question;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;

import javax.validation.Valid;

@RestController
public class QuestionController {

    @Autowired
    private QuestionRepository questionRepository;
    
    @Autowired
    private Environment environment;
    
    @Autowired
    private AuthConfig authConfigProperties;

    @CrossOrigin
    @GetMapping("/questions")
    public Page<Question> getQuestions(Pageable pageable) {
        return questionRepository.findAll(pageable);
    }

    @CrossOrigin
    @PostMapping("/questions")
    public Question createQuestion(@Valid @RequestBody Question question) {
        if (Arrays.asList(environment.getActiveProfiles()).contains("prod")) {
        	question.setTitle(question.getTitle() + "-prod");
        }
        if (this.authConfigProperties.isEnableDefaultUser()) {
        	question.setTitle(question.getTitle() + this.authConfigProperties.getDefaultUsername());
        }
        return questionRepository.save(question);
    }

    @PutMapping("/questions/{questionId}")
    public Question updateQuestion(@PathVariable Long questionId,
                                   @Valid @RequestBody Question questionRequest) {
        return questionRepository.findById(questionId)
                .map(question -> {
                    question.setTitle(questionRequest.getTitle());
                    question.setDescription(questionRequest.getDescription());
                    return questionRepository.save(question);
                }).orElseThrow(() -> new ResourceNotFoundException("Question not found with id " + questionId));
    }

    @DeleteMapping("/questions/{questionId}")
    public ResponseEntity<?> deleteQuestion(@PathVariable Long questionId) {
        return questionRepository.findById(questionId)
                .map(question -> {
                    questionRepository.delete(question);
                    return ResponseEntity.ok().build();
                }).orElseThrow(() -> new ResourceNotFoundException("Question not found with id " + questionId));
    }
}