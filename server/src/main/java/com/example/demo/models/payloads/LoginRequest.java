package com.example.demo.models.payloads;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.io.Serializable;

public class LoginRequest implements Serializable {
@NotNull
@NotBlank
    private String user;

@NotNull
@NotBlank
    private String password;

    public String getUser() {
        return user;
    }

    public void setUser(String user) {
        this.user = user;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public LoginRequest() {}

    public LoginRequest(String user, String password) {
        this.setUser(user);
        this.setPassword(password);
    }
}
