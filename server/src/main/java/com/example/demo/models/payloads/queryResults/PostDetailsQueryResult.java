package com.example.demo.models.payloads.queryResults;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.annotation.QueryResult;
import java.util.ArrayList;

@QueryResult
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class PostDetailsQueryResult {
    Long postId;
    String content;
    String date;
    Integer likes;
    Integer comments;
    ArrayList<String> imageNames=new ArrayList<>();

}
