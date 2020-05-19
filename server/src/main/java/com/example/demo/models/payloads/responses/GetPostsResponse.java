package com.example.demo.models.payloads.responses;
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
@NoArgsConstructor
@AllArgsConstructor
public class GetPostsResponse{
   private ArrayList<PostDetails>posts;
   private boolean last;
   private boolean empty;


   @Getter
   @Setter
   @AllArgsConstructor
   @NoArgsConstructor
   private class PostDetails{
      PostDetailsQueryResult post;
      boolean isLiked;
   }

   public void map(Slice<PostDetailsQueryResult>list,PostsRepository postsRepository,Long principalId){
      posts=new ArrayList<>();
      for (PostDetailsQueryResult element:list) {
         PostDetails postDetails=new PostDetails();
         postDetails.post=new PostDetailsQueryResult();
         postDetails.post=element;
         postDetails.isLiked=postsRepository.isLiked(principalId,element.getPostId());
      posts.add(postDetails);
      }
      this.last=list.isLast();
      this.empty=list.isEmpty();
   }

}