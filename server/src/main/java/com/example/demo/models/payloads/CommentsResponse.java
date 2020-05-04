package com.example.demo.models.payloads;
import com.example.demo.models.payloads.PayloadModels.CustomCommentDetails;
import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

@Getter
@Setter
@NoArgsConstructor
public class CommentsResponse{
    private String message;
    private boolean success;
    private ArrayList<CommentDetails>comments;

    public void addCommentsData(CustomUserDetails customUserDetails,CustomCommentDetails customCommentDetails){
        comments.add(new CommentDetails(customUserDetails,customCommentDetails));
    }

    @Getter
    @Setter
    @AllArgsConstructor
    private class CommentDetails{
        CustomUserDetails User;
        CustomCommentDetails Comment;

    }
}
