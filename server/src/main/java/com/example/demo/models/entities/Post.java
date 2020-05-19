package com.example.demo.models.entities;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.neo4j.ogm.annotation.GeneratedValue;
import org.neo4j.ogm.annotation.Id;
import org.neo4j.ogm.annotation.NodeEntity;
import org.neo4j.ogm.annotation.Relationship;
import org.neo4j.ogm.annotation.typeconversion.DateString;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
@NoArgsConstructor
@Setter
@Getter
@NodeEntity
public class Post {
    @Id
    @GeneratedValue
    private Long id;
    private String content;
    private ArrayList<String> imageNames=new ArrayList<>();
    @DateString("yyyy-MM-dd HH:mm:ss")
    private Date date;

    @Relationship(type="Liked",direction = Relationship.INCOMING)
    HashSet<User>userLikes=new HashSet<>();

    @JsonIgnoreProperties({"post","user"})
    @Relationship(type = "commented_on",direction = Relationship.INCOMING)
    HashSet<Comment>comments=new HashSet<>();

}

