package com.example.demo.models.payloads.responses;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.io.Serializable;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ApiResponse implements Serializable {
    private String message;
    private Boolean success;


}
