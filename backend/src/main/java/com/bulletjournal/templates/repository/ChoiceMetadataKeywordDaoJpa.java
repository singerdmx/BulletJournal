package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Choice;
import com.bulletjournal.templates.repository.model.ChoiceMetadataKeyword;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Repository
public class ChoiceMetadataKeywordDaoJpa {
    @Autowired
    private ChoiceMetadataKeywordRepository choiceMetadataKeywordRepository;

    @Autowired
    private ChoiceDaoJpa choiceDaoJpa;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ChoiceMetadataKeyword save(Long choiceId, String keyword) {
        Choice choice = this.choiceDaoJpa.getById(choiceId);
        ChoiceMetadataKeyword choiceMetadataKeyword = new ChoiceMetadataKeyword();
        choiceMetadataKeyword.setChoice(choice);
        choiceMetadataKeyword.setKeyword(keyword);
        return this.choiceMetadataKeywordRepository.save(choiceMetadataKeyword);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteByKeyword(String keyword) {
        if (!choiceMetadataKeywordRepository.existsById(keyword)) {
            throw new ResourceNotFoundException("Keyword not found");
        }
        choiceMetadataKeywordRepository.deleteById(keyword);
    }


    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public ChoiceMetadataKeyword updateByKeyword(String keyword, Long choiceId) {
        ChoiceMetadataKeyword choiceMetadataKeyword = choiceMetadataKeywordRepository.findById(keyword)
                .orElseThrow(() -> new ResourceNotFoundException("Keyword not found"));
        Choice choice = choiceDaoJpa.getById(choiceId);
        choiceMetadataKeyword.setChoice(choice);
        return choiceMetadataKeywordRepository.save(choiceMetadataKeyword);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteByKeywords(List<String> keywords) {
        if (keywords.isEmpty()) {
            throw new BadRequestException("keywords is empty");
        }
        List<ChoiceMetadataKeyword> list = choiceMetadataKeywordRepository.findAllById(keywords)
                .stream().filter(Objects::nonNull).collect(Collectors.toList());
        choiceMetadataKeywordRepository.deleteAll(list);
    }
}
