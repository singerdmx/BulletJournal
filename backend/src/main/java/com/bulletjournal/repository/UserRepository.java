package com.bulletjournal.repository;

import com.bulletjournal.repository.models.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    User findByName(String name);

    List<User> findAllByNameIn(Set<String> usernames);

    @Query("SELECT u FROM User u WHERE u.role = :role")
    List<User> getUsersByRole(@Param("role") Integer role);
}
