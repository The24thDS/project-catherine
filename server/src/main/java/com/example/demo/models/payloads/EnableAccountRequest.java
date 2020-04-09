package com.example.demo.models.payloads;

import java.io.Serializable;

public class EnableAccountRequest implements Serializable {
    private String token;
    public EnableAccountRequest() {
    }

    public String getToken() {
        return token;
    }
    public void setToken(String token) {
        this.token = token;
    }
}
