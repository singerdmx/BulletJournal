package com.bulletjournal.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.repository.models.Label;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Repository
public class LabelDaoJpa {

    @Autowired
    private LabelRepository labelRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Label create(String name, String owner) {
        Label label = new Label();
        label.setName(name);
        label.setOwner(owner);

        if (!this.labelRepository.findByNameAndOwner(name, owner).isEmpty()) {
            throw new ResourceAlreadyExistException("Label with name " + name + " already exists");
        }

        label = this.labelRepository.save(label);
        return label;
    }
}
