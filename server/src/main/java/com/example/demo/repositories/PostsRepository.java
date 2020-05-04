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

    @Query("match(u:User)-[l:Liked]-(p:Post),(u)-[c:commented_on]-(p) where ID(u)=$id\n" +
        "return count(distinct l) as likes,count(distinct c) as comments,p.content as content,p.date as date,ID(p) as id")
    ArrayList<PostDetailsQueryResult> customFindPostsByUser(@Param("id")Long id);
}
