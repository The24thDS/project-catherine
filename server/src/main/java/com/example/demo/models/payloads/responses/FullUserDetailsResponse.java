package com.example.demo.models.payloads.responses;

import com.example.demo.models.payloads.PayloadModels.FullUserDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
public class FullUserDetailsResponse extends ApiResponse{
    FullUserDetails User;
}
