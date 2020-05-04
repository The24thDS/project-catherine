package com.example.demo.repositories;
import com.example.demo.models.entities.Comment;
import org.springframework.data.neo4j.annotation.Depth;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;


public interface CommentsRepository extends Neo4jRepository<Comment,Long> {
    @Depth(value = 2)
    @Query("match (u:User)-[c:commented_on]-(p:Post) where ID(p)=$id return c,u,p")
    List<Comment> findByPostId(@Param("id") Long id);
}
