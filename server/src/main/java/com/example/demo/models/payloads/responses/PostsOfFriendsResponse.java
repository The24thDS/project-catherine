package com.example.demo.models.payloads.responses;

import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import com.example.demo.models.payloads.queryResults.FriendsPostDetailsQueryResult;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
import com.example.demo.repositories.PostsRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.domain.Slice;
import java.util.ArrayList;


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
        boolean isLiked;
    }

    public void map(Slice<FriendsPostDetailsQueryResult> list, PostsRepository postsRepository,Long principalId){
        posts=new ArrayList<>();
        for (FriendsPostDetailsQueryResult element:list) {
            CustomUserDetails userDetails=new CustomUserDetails(element.getUserId(),element.getFirstName(),element.getLastName(),element.getProfilePicture());
            PostDetailsQueryResult postDetailsQueryResult=
                    new PostDetailsQueryResult(element.getPostId(),element.getContent(),element.getDate(), element.getLikes(),element.getComments(),element.getImageNames());
            boolean isLiked=postsRepository.isLiked(principalId,postDetailsQueryResult.getPostId());
            PostDetails postDetails=new PostDetails(userDetails,postDetailsQueryResult,isLiked);
            posts.add(postDetails);
        }
        this.last=list.isLast();
        this.empty=list.isEmpty();

}
}
