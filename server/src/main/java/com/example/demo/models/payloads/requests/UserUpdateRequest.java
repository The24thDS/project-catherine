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

    @NotBlank(message = "Email is blank")
    @Email(message = "Invalid email")
    private String email;

    @Size(min=10,message = "New Password is too short")
    @NotBlank(message = "New Password is blank")
    private String password;

    public String getPassword2() {
        return password2;
    }


    @Size(min=10,message = "Old Password is too short")
    @NotBlank(message = "Old Password is blank")
    private String password2;


    @NotBlank(message = "First name is blank")
    private String firstName;

    @NotBlank(message = "Last name is blank")
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
