package com.example.demo.models.payloads.PayloadModels;
import lombok.*;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class CustomUserDetails implements Serializable {
        private Long id;
        private String firstName;
        private String lastName;
        private String profilePicture;

}
