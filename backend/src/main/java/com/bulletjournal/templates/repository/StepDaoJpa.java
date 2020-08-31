package com.bulletjournal.templates.repository;

import com.bulletjournal.templates.repository.model.Step;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class StepDaoJpa {

    private StepRepository stepRepository;

    @Autowired
    public StepDaoJpa(
        StepRepository stepRepository
    ) {
        this.stepRepository = stepRepository;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Step> findAll() {
        return stepRepository.findAll();
    }
}
