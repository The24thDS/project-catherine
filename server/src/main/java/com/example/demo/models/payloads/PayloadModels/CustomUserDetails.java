package com.example.demo.models.payloads.PayloadModels;
import lombok.*;
import org.springframework.data.neo4j.annotation.QueryResult;

import java.io.Serializable;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@QueryResult
public class CustomUserDetails implements Serializable {
        private Long id;
        private String firstName;
        private String lastName;
        private String profilePicture;

}
