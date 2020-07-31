package com.bulletjournal.repository;

import com.bulletjournal.repository.models.DeviceToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface DeviceTokenRepository extends JpaRepository<DeviceToken, Long> {

    DeviceToken findDeviceTokenByToken(String token);

    @Query("SELECT t FROM DeviceToken t WHERE t.username = ?1")
    List<DeviceToken> findDeviceTokensByUser(String username);

    @Query("SELECT t FROM DeviceToken t WHERE t.username IN ?1")
    List<DeviceToken> findDeviceTokensByUsers(Set<String> usernames);
}
