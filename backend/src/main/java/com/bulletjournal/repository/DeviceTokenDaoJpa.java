package com.bulletjournal.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.exceptions.ResourceNotFoundException;
import com.bulletjournal.repository.models.DeviceToken;
import com.bulletjournal.repository.models.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Set;

@Repository
public class DeviceTokenDaoJpa {

    @Autowired
    UserDaoJpa userDaoJpa;

    @Autowired
    DeviceTokenRepository deviceTokenRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public DeviceToken create(String token, String userName) {
        DeviceToken existingToken = deviceTokenRepository.findDeviceTokenByToken(token);
        if (existingToken != null) {
            throw new ResourceAlreadyExistException("DeviceToken " + token + " already exists");
        }
        User user = userDaoJpa.getByName(userName);
        DeviceToken deviceToken = new DeviceToken(user, token);
        deviceTokenRepository.save(deviceToken);
        return deviceToken;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUser(DeviceToken deviceToken, String userName) {
        User user = userDaoJpa.getByName(userName);
        if (user == null) {
            throw new ResourceNotFoundException("User " + userName + " doesn't exist");
        }
        deviceToken.setUser(user);
        deviceTokenRepository.save(deviceToken);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public boolean deleteToken(String token) {
        DeviceToken existingToken = deviceTokenRepository.findDeviceTokenByToken(token);
        if (existingToken != null) {
            deviceTokenRepository.delete(existingToken);
            return true;
        }
        return false;
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public Set<DeviceToken> getTokensByUser(String userName) {
        User user = userDaoJpa.getByName(userName);
        if (user == null) {
            throw new ResourceNotFoundException("User " + userName + " doesn't exist");
        }
        return user.getTokens();
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public DeviceToken get(String token) {
        return deviceTokenRepository.findDeviceTokenByToken(token);
    }
}
