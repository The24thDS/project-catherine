package com.example.demo.models.payloads;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;

public class UserUpdateRequest implements Serializable {

    @NotBlank(message = "Email is blank")
    @Email(message = "Invalid email")
    private String email;

    @Size(min=10,message = "New Password is too short")
    @NotBlank(message = "New Password is blank")
    private String password;

    public String getPassword2() {
        return password2;
    }

    public void setPassword2(String password2) {
        this.password2 = password2;
    }

    @Size(min=10,message = "Old Password is too short")
    @NotBlank(message = "Old Password is blank")
    private String password2;


    @NotBlank(message = "First name is blank")
    private String first_name;

    @NotBlank(message = "Last name is blank")
    private String last_name;


    @Past(message="Birth date should be in the past")
    private Date birth_date;

    public Date getBirth_date() {
        return birth_date;
    }

    public void setBirth_date(Date birth_date) {
        this.birth_date = birth_date;
    }

    public UserUpdateRequest(String first_name, String email, String password, String last_name) {
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

    public UserUpdateRequest() {
    }
}