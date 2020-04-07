package com.example.demo.models.payloads;

import java.io.Serializable;

public class AvailabilityRequest implements Serializable {
    private String input;

    public AvailabilityRequest(String input) {
        this.input = input;
    }

    public String getInput() {
        return input;
    }

    public void setInput(String input) {
        this.input = input;
    }

    public AvailabilityRequest() {
    }
}
