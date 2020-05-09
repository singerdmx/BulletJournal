package com.bulletjournal.repository;

import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.UserAlias;
import com.google.gson.Gson;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Map;

@Repository
public class UserAliasDaoJpa {

    private static final Gson GSON = new Gson();

    @Autowired
    private UserAliasRepository userAliasRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void changeAlias(String requester, String targetUser, String alias) {
        UserAlias userAlias = userAliasRepository.findById(requester).orElse(new UserAlias(requester));
        Map<String, String> aliases = GSON.fromJson(userAlias.getAliases(), Map.class);
        aliases.put(targetUser, alias);
        userAlias.setAliases(GSON.toJson(aliases));
        this.userAliasRepository.save(userAlias);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Map<String, String> getAliases(String requester) {
        UserAlias userAlias = userAliasRepository.findById(requester)
                .orElseThrow(() -> new ResourceNotFoundException("UserAlias for " + requester + " not found"));
        Map<String, String> aliases = GSON.fromJson(userAlias.getAliases(), Map.class);
        return aliases;
    }
}
