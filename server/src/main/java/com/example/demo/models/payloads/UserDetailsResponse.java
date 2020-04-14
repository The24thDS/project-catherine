package com.example.demo.models.payloads;
import java.io.Serializable;


public class UserDetailsResponse implements Serializable {
    private String email;
    private String first_name;
    private String last_name;
    private String birth_date;
    private boolean success;

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public void setBirth_date(String birth_date) {
        this.birth_date = birth_date;
    }

    public void setSuccess(boolean success) {
        this.success = success;
    }

    public UserDetailsResponse() {
    }

    public String getEmail() {
        return email;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public String getBirth_date() {
        return birth_date;
    }

    public boolean isSuccess() {
        return success;
    }
}
