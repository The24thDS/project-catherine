package com.example.demo.models.payloads.queryResults;

import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.neo4j.ogm.annotation.typeconversion.DateString;
import org.springframework.data.neo4j.annotation.QueryResult;

import java.util.Date;

@QueryResult
@Getter
@Setter
@NoArgsConstructor
public class PostDetailsQueryResult {
    Long id;
    String content;
    @DateString("yyyy-MM-dd hh:mm:ss")
    Date date;
    Integer likes;
    Integer comments;
}
