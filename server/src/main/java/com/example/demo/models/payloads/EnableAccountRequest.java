package com.example.demo.models.payloads;

import java.io.Serializable;

public class EnableAccountRequest implements Serializable {
    private String token;
    private String user;

    public EnableAccountRequest() {
    }

    public String getToken() {
        return token;
    }

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
