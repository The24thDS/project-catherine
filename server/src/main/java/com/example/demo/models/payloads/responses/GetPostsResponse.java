package com.example.demo.models.payloads.responses;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;

@Getter
@Setter
public class GetPostsResponse extends ApiResponse {
   ArrayList<PostDetailsQueryResult>posts;

}
