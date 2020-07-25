package com.bulletjournal.firebase;


import com.google.common.base.Preconditions;

import java.util.HashMap;
import java.util.Map;

public class FcmMessageParams {

    private String token;
    private Map<String, String> data;

    public FcmMessageParams(String token, String...kv) {
        Preconditions.checkArgument((kv.length & 1) == 0,
            "Argument kv must be Key-Value pairs");
        this.token = token;
        this.data = new HashMap<>();
        for (int i = 0; i < kv.length; i += 2) {
            data.put(kv[i], kv[i + 1]);
        }
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Map<String, String> getData() {
        return data;
    }

    public void setData(Map<String, String> data) {
        this.data = data;
    }

    @Override
    public String toString() {
        return "FcmMessageParams{" +
            "token='" + token + '\'' +
            ", data=" + data +
            '}';
    }
}
