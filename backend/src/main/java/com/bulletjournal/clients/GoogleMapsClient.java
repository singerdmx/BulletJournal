package com.bulletjournal.clients;

import com.bulletjournal.config.GoogleMapsClientConfig;
import com.google.maps.FindPlaceFromTextRequest;
import com.google.maps.GeoApiContext;
import com.google.maps.PlacesApi;
import com.google.maps.errors.ApiException;
import com.google.maps.model.FindPlaceFromText;
import com.google.maps.model.LatLng;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import javax.annotation.PostConstruct;
import javax.annotation.PreDestroy;
import java.io.IOException;

@Component
public class GoogleMapsClient {

    @Autowired
    private GoogleMapsClientConfig googleMapsClientConfig;

    private GeoApiContext geoApiContext;

    @PostConstruct
    public void init() {
        if (this.googleMapsClientConfig.getApiKey() != null) {
            geoApiContext = new GeoApiContext.Builder()
                    .apiKey(this.googleMapsClientConfig.getApiKey())
                    .build();
        }
    }

    @PreDestroy
    public void cleanup() {
        if (this.geoApiContext != null) {
            this.geoApiContext.shutdown();
        }
    }

    /**
     * refer to https://github.com/googlemaps/google-maps-services-java/blob/master/src/test/java/com/google/maps/PlacesApiTest.java
     *
     * @param lat The latitude of this location.
     * @param lng The longitude of this location.
     */
    public FindPlaceFromText findPlaceFromText(String input, double lat, double lng)
            throws InterruptedException, ApiException, IOException {
        if (this.geoApiContext == null) {
            throw new IllegalStateException("Missing GOOGLE_MAPS_API_KEY");
        }
        LatLng point = new LatLng(lat, lng);
        FindPlaceFromText response = PlacesApi
                .findPlaceFromText(this.geoApiContext, input, FindPlaceFromTextRequest.InputType.TEXT_QUERY)
                .fields(FindPlaceFromTextRequest.FieldMask.FORMATTED_ADDRESS,
                        FindPlaceFromTextRequest.FieldMask.NAME,
                        FindPlaceFromTextRequest.FieldMask.GEOMETRY)
                .locationBias(new FindPlaceFromTextRequest.LocationBiasPoint(point)).await();
        return response;
    }
}
