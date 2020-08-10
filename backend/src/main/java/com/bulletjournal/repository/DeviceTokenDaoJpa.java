package com.bulletjournal.repository;

import com.bulletjournal.exceptions.ResourceAlreadyExistException;
import com.bulletjournal.repository.models.DeviceToken;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collection;
import java.util.HashSet;
import java.util.List;

@Repository
public class DeviceTokenDaoJpa {

    @Autowired
    DeviceTokenRepository deviceTokenRepository;

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public DeviceToken create(String token, String userName) {
        DeviceToken existingToken = deviceTokenRepository.findDeviceTokenByToken(token);
        if (existingToken != null) {
            throw new ResourceAlreadyExistException("DeviceToken " + token + " already exists");
        }
        DeviceToken deviceToken = new DeviceToken(userName, token);
        return deviceTokenRepository.save(deviceToken);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void updateUser(DeviceToken deviceToken, String userName) {
        deviceToken.setUsername(userName);
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
    public List<DeviceToken> getTokensByUser(String userName) {
        return deviceTokenRepository.findDeviceTokensByUser(userName);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public List<DeviceToken> getTokensByUsers(Collection<String> userNames) {
        return deviceTokenRepository.findDeviceTokensByUsers(new HashSet<>(userNames));
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public DeviceToken get(String token) {
        return deviceTokenRepository.findDeviceTokenByToken(token);
    }

    @Transactional(rollbackFor = Exception.class, propagation = Propagation.REQUIRED)
    public void deleteAllTokens() {
        deviceTokenRepository.deleteAll();
    }
}
