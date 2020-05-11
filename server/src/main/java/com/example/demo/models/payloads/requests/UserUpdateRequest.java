package com.example.demo.models.payloads.requests;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Past;
import javax.validation.constraints.Size;
import java.io.Serializable;
import java.util.Date;
@Getter
@Setter
@NoArgsConstructor
public class UserUpdateRequest implements Serializable {


    @Email(message = "Invalid email")
    private String email;

    @Size(min = 8,message = "Password length should be greater than 8")
    private String password;
    @Size(min = 8,message = "Password length should be greater than 8")
    private String password2;


   @Size(min = 2,message = "First Name should contain at least 2 characters")
    private String firstName;

    @Size(min = 2,message = "Last name should contain at least 2 characters")
    private String lastName;


    @Past(message="Birth date should be in the past")
    private Date birthDate;


    public UserUpdateRequest(String first_name, String email, String password, String last_name) {
        this.firstName = first_name;
        this.email = email;
        this.password = password;
        this.lastName =last_name;
    }


}
