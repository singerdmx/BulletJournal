package com.bulletjournal.repository.models;

import javax.persistence.*;
import java.util.Objects;

@Entity
@Table(name = "device_tokens")
public class DeviceToken extends AuditModel {
    @Id
    @GeneratedValue(generator = "device_token_generator")
    @SequenceGenerator(name = "device_token_generator", sequenceName = "device_token_sequence", initialValue = 100, allocationSize = 2)
    private Long id;

    @Column(nullable = false)
    private String token;

    @Column(name = "username", nullable = false)
    private String username;

    public DeviceToken() {
    }

    public DeviceToken(String username, String token) {
        this.username = username;
        this.token = token;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @Override
    public int hashCode() {
        return Objects.hash(username, token);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (obj == null || getClass() != obj.getClass()) return false;
        DeviceToken that = (DeviceToken) obj;
        return Objects.equals(username, that.username)
            && Objects.equals(token, that.token);
    }
}
