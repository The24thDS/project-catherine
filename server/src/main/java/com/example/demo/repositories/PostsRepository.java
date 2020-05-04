package com.example.demo.repositories;
import com.example.demo.models.entities.Post;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;

@Repository
public interface PostsRepository extends Neo4jRepository<Post,Long> {

    @Query("MATCH (u:User)-[:Posted]->(z:Post) where ID(u)=$id\n" +
            "RETURN z.content as content,z.imageNames as imageNames,z.date as date,ID(z) as id, " +
            "SIZE( ()-[:Liked]->(z) ) as likes,SIZE( ()-[:commented_on]->(z) ) as comments")
    ArrayList<PostDetailsQueryResult> customFindPostsByUser(@Param("id")Long id);
}
