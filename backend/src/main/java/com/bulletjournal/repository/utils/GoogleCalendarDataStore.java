package com.bulletjournal.repository.utils;

import com.bulletjournal.exceptions.BadRequestException;
import com.bulletjournal.repository.GoogleCredentialRepository;
import com.bulletjournal.repository.models.GoogleCredential;
import com.google.api.client.auth.oauth2.StoredCredential;
import com.google.api.client.util.store.AbstractDataStore;
import com.google.api.client.util.store.DataStore;
import com.google.api.client.util.store.DataStoreFactory;

import java.io.IOException;
import java.util.Collection;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

public class GoogleCalendarDataStore extends AbstractDataStore<StoredCredential> {

    private final GoogleCredentialRepository repository;

    /**
     * @param dataStoreFactory data store factory
     * @param id               data store ID
     */
    protected GoogleCalendarDataStore(
            DataStoreFactory dataStoreFactory, String id, GoogleCredentialRepository googleCredentialRepository) {
        super(dataStoreFactory, id);
        this.repository = googleCredentialRepository;
    }

    @Override
    public Set<String> keySet() throws IOException {
        return this.repository.findAllKeys();
    }

    @Override
    public Collection<StoredCredential> values() throws IOException {
        return repository.findAll().stream().map(c -> {
            StoredCredential credential = new StoredCredential();
            credential.setAccessToken(c.getAccessToken());
            credential.setRefreshToken(c.getRefreshToken());
            credential.setExpirationTimeMilliseconds(c.getExpirationTimeMilliseconds());
            return credential;
        }).collect(Collectors.toList());
    }

    @Override
    public StoredCredential get(String key) throws IOException {
        Optional<GoogleCredential> jpaStoredCredentialOptional = repository.findByKey(key);
        if (!jpaStoredCredentialOptional.isPresent()) {
            return null;
        }
        GoogleCredential googleCredential = jpaStoredCredentialOptional.get();
        StoredCredential credential = new StoredCredential();
        credential.setAccessToken(googleCredential.getAccessToken());
        credential.setRefreshToken(googleCredential.getRefreshToken());
        credential.setExpirationTimeMilliseconds(googleCredential.getExpirationTimeMilliseconds());
        return credential;
    }

    @Override
    public DataStore<StoredCredential> set(String key, StoredCredential value) throws IOException {
        GoogleCredential googleCredential = repository.findByKey(key).orElse(new GoogleCredential(key, value));
        googleCredential.apply(value);
        repository.save(googleCredential);
        return this;
    }

    @Override
    public DataStore<StoredCredential> clear() throws IOException {
        repository.deleteAll();
        return this;
    }

    @Override
    public DataStore<StoredCredential> delete(String key) throws IOException {
        GoogleCredential googleCredential = repository.findByKey(key)
                .orElseThrow(() -> new BadRequestException("key " + key + " does not exist"));
        repository.delete(googleCredential);
        return this;
    }
}
