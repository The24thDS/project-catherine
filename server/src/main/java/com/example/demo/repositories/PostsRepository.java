package com.example.demo.repositories;
import com.example.demo.models.entities.Post;
import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import com.example.demo.models.payloads.queryResults.FriendsPostDetailsQueryResult;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.PagingAndSortingRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface PostsRepository extends Neo4jRepository<Post,Long>, PagingAndSortingRepository<Post,Long> {

    @Query(value="MATCH (u:User)-[:Posted]->(z:Post) where ID(u)=$id\n" +
            "RETURN z.content as content,z.imageNames as imageNames,z.date as date,ID(z) as postId, " +
            "SIZE( ()-[:Liked]->(z) ) as likes,SIZE( ()-[:commented_on]->(z) ) as comments", countQuery = "MATCH (u:User)-[:Posted]->(z:Post) where ID(u)=$id")
    Slice<PostDetailsQueryResult> customFindPostsByUser(@Param("id")Long id,Pageable pageable);


    @Query(value = "match (u:User)-[f:Friends_With]->(u1:User) where ID(u)=$id with u1 match (u1)-[:Posted]-(p:Post)\n" +
            "return  u1.firstName as firstName, u1.lastName as lastName, id(u1) as userId, u1.profilePicture as profilePicture, SIZE( ()-[:Liked]->(p) ) as likes, " +
            "SIZE( ()-[:commented_on]->(p) ) as comments, p.date as date, p.content as content, collect(p.imageNames) as imageNames, id(p) as postId",
            countQuery="match (u:User)-[f:Friends_With]->(u1:User) where ID(u)=$id with u1 match (u1)-[:Posted]-(p:Post)\n" +
            "return  count(u1.firstName)")
    Slice<FriendsPostDetailsQueryResult> customFindFriendsPosts(@Param("id")Long id, Pageable pageable);


    @Query(value = "match(u:User)-[l:Liked]->(p:Post) where id(p)=$id return u.firstName as firstName, u.lastName as lastName,u.profilePicture as profilePicture,id(u) as id",
            countQuery ="match(u:User)-[l:Liked]->(p:Post) where id(p)=$id return  count(u.firstName)" )
    Slice<CustomUserDetails>findUsersThatLikedPost(@Param("id") Long id, Pageable pageable);

    @Query("match(u:User)-[l:Liked]-(p:Post) where id(u)=$userId and id(p)=$postId return count(l)>0")
    boolean isLiked(@Param("userId")Long userId,@Param("postId")Long postId);
}

