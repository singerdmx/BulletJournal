package com.bulletjournal.repository.utils;

import com.bulletjournal.repository.GoogleCredentialRepository;
import com.google.api.client.auth.oauth2.StoredCredential;
import com.google.api.client.util.store.AbstractDataStoreFactory;
import com.google.api.client.util.store.DataStore;
import org.springframework.stereotype.Repository;

import java.io.IOException;

@Repository
public class GoogleCalendarDataStoreFactory extends AbstractDataStoreFactory {

    private final GoogleCredentialRepository googleCredentialRepository;

    public GoogleCalendarDataStoreFactory(GoogleCredentialRepository googleCredentialRepository) {
        this.googleCredentialRepository = googleCredentialRepository;
    }

    @Override
    protected DataStore<StoredCredential> createDataStore(String id) throws IOException {
        return new GoogleCalendarDataStore(this, id, googleCredentialRepository);
    }
}
