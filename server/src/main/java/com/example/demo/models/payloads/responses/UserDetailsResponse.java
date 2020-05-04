package com.example.demo.models.payloads.responses;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
public class UserDetailsResponse implements Serializable {
    private String email;
    private String firstName;
    private String lastName;
    private String birthDate;
    private Long id;
    private String profilePicture;
    private boolean success;
    }