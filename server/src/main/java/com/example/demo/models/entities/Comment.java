package com.example.demo.models.entities;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;
import org.neo4j.ogm.annotation.*;
import org.neo4j.ogm.annotation.typeconversion.DateString;


import java.util.Date;

@Getter
@Setter
@RelationshipEntity(type = "commented_on")
public class Comment {
    @Id
    @GeneratedValue
    private Long relationshipId;
    private String text;
    @DateString("yyyy-MM-dd hh:mm:ss")
    private Date date;

    @StartNode

    private  User user;
    @EndNode
    @JsonIgnore
    private Post post;
}
