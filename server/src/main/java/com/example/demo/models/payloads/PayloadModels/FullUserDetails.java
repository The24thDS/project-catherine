package com.example.demo.models.payloads.PayloadModels;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FullUserDetails implements Serializable {
    private String email;
    private String firstName;
    private String lastName;
    private String birthDate;
    private Long id;
    private String profilePicture;



    }
