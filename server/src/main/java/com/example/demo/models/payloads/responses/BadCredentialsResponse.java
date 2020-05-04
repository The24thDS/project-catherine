package com.example.demo.models.payloads.responses;

import java.io.Serializable;

public class BadCredentialsResponse implements Serializable {

    private String reason;
    public BadCredentialsResponse( String reason) {

        this.reason = reason;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}
