package com.example.demo.models.payloads;

import java.io.Serializable;

public class BadCredentialsResponse implements Serializable {

    String reason;
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
