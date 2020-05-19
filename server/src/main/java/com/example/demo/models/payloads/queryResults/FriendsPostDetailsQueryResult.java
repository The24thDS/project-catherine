package com.example.demo.models.payloads.queryResults;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.data.neo4j.annotation.QueryResult;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@QueryResult
public class FriendsPostDetailsQueryResult extends PostDetailsQueryResult  {
    private Long userId;
    private String firstName;
    private String lastName;
    private String profilePicture;

}
