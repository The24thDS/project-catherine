package com.example.demo.models.payloads.requests;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

public class LoginRequest implements Serializable {
@NotNull
@NotBlank
    private String email;

@NotNull
@NotBlank
    private String password;

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LoginRequest() {}

    public LoginRequest(String email, String password) {
        this.setEmail(email);
        this.setPassword(password);
    }
}
