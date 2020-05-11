package com.example.demo.models.payloads.responses;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
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
   private ArrayList<PostDetailsQueryResult>posts;
   private boolean last;
   private boolean empty;

   public void map(Slice<PostDetailsQueryResult>list){
      posts=new ArrayList<>();
      for (PostDetailsQueryResult element:list) {
      posts.add(element);
      }
      this.last=list.isLast();
      this.empty=list.isEmpty();
   }

}
