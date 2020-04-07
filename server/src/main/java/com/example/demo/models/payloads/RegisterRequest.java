package com.example.demo.models.payloads;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

public class RegisterRequest implements Serializable {

   @NotBlank
   @NotNull
      @Email(message = "invalid email")
  private String email;

   @Size(min=10,message = "password too short")
   @NotBlank
   @NotNull
   private String password;


    @NotBlank
    @NotNull
    private String first_name;

    @NotBlank
    @NotNull
    private String last_name;

    @NotNull
    private Date birth_date;

    public Date getBirth_date() {
        return birth_date;
    }

    public void setBirth_date(Date birth_date) {
        this.birth_date = birth_date;
    }

    public RegisterRequest(String first_name, String email, String password, String last_name) {
        this.first_name = first_name;
        this.email = email;
        this.password = password;
        this.last_name=last_name;
    }


    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }


    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getFirst_name() {
        return first_name;
    }

    public void setFirst_name(String first_name) {
        this.first_name = first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public void setLast_name(String last_name) {
        this.last_name = last_name;
    }

    public RegisterRequest() {
    }
}
