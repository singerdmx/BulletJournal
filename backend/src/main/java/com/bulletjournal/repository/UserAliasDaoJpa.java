package com.bulletjournal.repository;

import com.bulletjournal.clients.UserClient;
import com.bulletjournal.controller.models.User;
import com.bulletjournal.redis.RedisUserAliasesRepository;
import com.bulletjournal.redis.models.UserAliases;
import com.bulletjournal.repository.models.UserAlias;
import com.google.gson.Gson;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;
import java.util.Objects;
import java.util.Optional;

@Repository
public class UserAliasDaoJpa {
    private static final Logger LOGGER = LoggerFactory.getLogger(UserAliasDaoJpa.class);
    private static final Gson GSON = new Gson();

    @Autowired
    private UserAliasRepository userAliasRepository;

    @Autowired
    private RedisUserAliasesRepository redisUserAliasesRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void changeAlias(String requester, String targetUser, String alias) {
        UserAlias userAlias = userAliasRepository.findById(requester).orElse(new UserAlias(requester));
        Map<String, String> aliases = GSON.fromJson(userAlias.getAliases(), Map.class);
        if (Objects.equals(targetUser, alias)) {
            aliases.remove(targetUser);
        } else {
            aliases.put(targetUser, alias);
        }
        userAlias.setAliases(GSON.toJson(aliases));
        this.userAliasRepository.save(userAlias);
        this.redisUserAliasesRepository.save(new UserAliases(requester, aliases));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Map<String, String> getAliases(String requester) {
        Map<String, String> aliases = Collections.emptyMap();
        Optional<UserAliases> userAliases = this.redisUserAliasesRepository.findById(requester);
        if (userAliases.isPresent()) {
            aliases = userAliases.get().getAliases();
            return aliases == null ? Collections.emptyMap() : aliases;
        }
        Optional<UserAlias> userAlias = userAliasRepository.findById(requester);
        if (userAlias.isPresent()) {
            aliases = GSON.fromJson(userAlias.get().getAliases(), Map.class);
        }
        LOGGER.info("getAliases for " + requester + ": " + aliases);
        this.redisUserAliasesRepository.save(new UserAliases(requester, aliases));
        return aliases;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public User updateUserAlias(User user) {
        String requester = MDC.get(UserClient.USER_NAME_KEY);
        if (requester == null) {
            // handle request from daemon thread
            return user;
        }
        Map<String, String> aliases = this.getAliases(requester);
        if (aliases.isEmpty()) {
            return user;
        }
        user.setAlias(aliases.getOrDefault(user.getName(), user.getName()));
        return user;
    }
}
