package com.example.demo.repositories;
import com.example.demo.models.entities.Comment;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.neo4j.annotation.Depth;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;
public interface CommentsRepository extends Neo4jRepository<Comment,Long> {
    @Depth(value = 2)
    @Query(value = "match (u:User)-[c:commented_on]-(p:Post) where ID(p)=$id return c,u,p",countQuery = "match (u:User)-[c:commented_on]->(p:Post) where ID(p)=$id return count(u)")
    Slice<Comment> findByPostId(@Param("id") Long id,Pageable pageable);


}
