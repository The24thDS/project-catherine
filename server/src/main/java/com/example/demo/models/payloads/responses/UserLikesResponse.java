package com.example.demo.models.payloads.responses;

import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Slice;

import java.util.ArrayList;
@Getter
@Setter
public class UserLikesResponse  {
    private ArrayList<CustomUserDetails>users;
    private boolean last;
    private boolean empty;
    public void map(Slice<CustomUserDetails>list){
        users=new ArrayList<>();
        for (CustomUserDetails element: list) {
            users.add(element);
        }
        this.last=list.isLast();
        this.empty=list.isEmpty();
    }

}
