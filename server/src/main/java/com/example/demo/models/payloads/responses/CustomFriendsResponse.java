package com.example.demo.models.payloads.responses;

import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


import java.io.Serializable;
import java.util.HashSet;
@Getter
@Setter
public class CustomFriendsResponse extends ApiResponse implements Serializable{
    private HashSet<FriendDetails> users=new HashSet<>();

    public void addUser(Long id,String first_name,String last_name,String profilePicture,String email,boolean online){
        FriendDetails friendDetails=new FriendDetails();
        friendDetails.setEmail(email);
        friendDetails.setFirstName(first_name);
        friendDetails.setLastName(last_name);
        friendDetails.setId(id);
        friendDetails.setProfilePicture(profilePicture);
        friendDetails.setOnline(online);
        users.add(friendDetails);

    }

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
private class FriendDetails extends CustomUserDetails{
       private String email;
       private boolean online;
}

}
