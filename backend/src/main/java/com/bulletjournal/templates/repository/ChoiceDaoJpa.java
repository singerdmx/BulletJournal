package com.bulletjournal.templates.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.templates.repository.model.Choice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public class ChoiceDaoJpa {
    @Autowired
    ChoiceRepository choiceRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<Choice> getChoicesById(List<Long> ids) {
        List<Choice> choices = choiceRepository.findAllById(ids);
        if (choices.isEmpty()) {
            StringBuilder sb = new StringBuilder();
            ids.forEach(id -> {
                sb.append(id).append(" ");
            });
            throw new ResourceNotFoundException("Choice with ids " + sb.toString() + "doesn't exist");
        }
        return choices;
    }
}
