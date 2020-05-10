package com.example.demo.models.payloads.responses;

import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CustomUserDetailsResponse extends ApiResponse {
    CustomUserDetails user;

}
