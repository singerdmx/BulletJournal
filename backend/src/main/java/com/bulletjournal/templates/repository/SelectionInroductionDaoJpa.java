package com.bulletjournal.templates.repository;

import org.springframework.stereotype.Repository;

@Repository
public class SelectionInroductionDaoJpa {
    SelectionIntroductionRepository selectionIntroductionRepository;

    public SelectionInroductionDaoJpa(SelectionIntroductionRepository selectionIntroductionRepository) {
        this.selectionIntroductionRepository = selectionIntroductionRepository;
    }
}
