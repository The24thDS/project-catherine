package com.example.demo.models.payloads.responses;
import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.io.Serializable;
import java.util.HashSet;

@Getter
@Setter
@NoArgsConstructor
public class CustomUserResponse implements Serializable {
    private String message;
    private boolean success;
    private HashSet<CustomUserDetails>users=new HashSet<>();

    public void addUser(Long id,String first_name,String last_name,String profilePicture){
        CustomUserDetails customUserDetails=new CustomUserDetails(id,first_name,last_name,profilePicture);
        users.add(customUserDetails);
}


}
