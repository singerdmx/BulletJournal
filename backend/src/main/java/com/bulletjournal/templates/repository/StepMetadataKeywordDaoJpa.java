package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Step;
import com.bulletjournal.templates.repository.model.StepMetadataKeyword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class StepMetadataKeywordDaoJpa {
    @Autowired
    private StepMetadataKeywordRepository stepMetadataKeywordRepository;

    @Autowired
    private StepDaoJpa stepDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public StepMetadataKeyword save(Long stepId, String keyword) {
        Step step = this.stepDaoJpa.getById(stepId);
        StepMetadataKeyword stepMetadataKeyword = new StepMetadataKeyword();
        stepMetadataKeyword.setStep(step);
        stepMetadataKeyword.setKeyword(keyword);
        return this.stepMetadataKeywordRepository.save(stepMetadataKeyword);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteByKeyword(String keyword) {
        if (!stepMetadataKeywordRepository.existsById(keyword)) {
            throw new ResourceNotFoundException("Keyword not found");
        }
        stepMetadataKeywordRepository.deleteById(keyword);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public StepMetadataKeyword updateByKeyword(String keyword, Long choiceId) {
        StepMetadataKeyword stepMetadataKeyword = stepMetadataKeywordRepository.findById(keyword)
                .orElseThrow(() -> new ResourceNotFoundException("Keyword not found"));
        Step step = stepDaoJpa.getById(choiceId);
        stepMetadataKeyword.setStep(step);
        return stepMetadataKeywordRepository.save(stepMetadataKeyword);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteByKeywords(List<String> keywords) {
        if (keywords.isEmpty()) {
            throw new BadRequestException("keywords is empty");
        }
        List<StepMetadataKeyword> list = stepMetadataKeywordRepository.findAllById(keywords)
                .stream().filter(Objects::nonNull).collect(Collectors.toList());
        stepMetadataKeywordRepository.deleteAll(list);
    }
}
