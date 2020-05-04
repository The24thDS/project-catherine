package com.example.demo.models.payloads.queryResults;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.annotation.QueryResult;
@QueryResult
@Getter
@Setter
@NoArgsConstructor
public class PostDetailsQueryResult {
    Long id;
    String content;
    String date;
    Integer likes;
    Integer comments;
}
