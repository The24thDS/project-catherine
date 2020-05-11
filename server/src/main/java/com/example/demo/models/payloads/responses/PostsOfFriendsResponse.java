package com.example.demo.models.payloads.responses;

import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import com.example.demo.models.payloads.queryResults.FriendsPostDetailsQueryResult;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Slice;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class PostsOfFriendsResponse{
    ArrayList<PostDetails>posts;
    boolean last;
    boolean empty;
    @Getter
    @Setter
    @AllArgsConstructor
    private class PostDetails{
        CustomUserDetails user;
        PostDetailsQueryResult post;
    }

    public void map(Slice<FriendsPostDetailsQueryResult> list){
        posts=new ArrayList<>();
        for (FriendsPostDetailsQueryResult element:list) {
            CustomUserDetails userDetails=new CustomUserDetails(element.getUserId(),element.getFirstName(),element.getLastName(),element.getProfilePicture());
            PostDetailsQueryResult postDetailsQueryResult=
                    new PostDetailsQueryResult(element.getPostId(),element.getContent(),element.getDate(), element.getLikes(),element.getComments(),element.getImageNames());
            PostDetails postDetails=new PostDetails(userDetails,postDetailsQueryResult);
            posts.add(postDetails);
        }
        this.last=list.isLast();
        this.empty=list.isEmpty();

}
}
