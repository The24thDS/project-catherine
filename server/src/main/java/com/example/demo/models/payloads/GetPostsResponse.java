package com.example.demo.models.payloads;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
import lombok.Data;
import java.io.Serializable;
import java.util.ArrayList;

@Data
public class GetPostsResponse implements Serializable {
   String message;
   boolean success;
   ArrayList<PostDetailsQueryResult>posts;

}
