package com.example.demo.repositories;

import com.example.demo.models.entities.User;
import com.example.demo.models.entities.VerificationToken;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends Neo4jRepository<User,Long> {
    Optional<User> findByEmail(String email);
   boolean existsByEmail(String email);

    @Query("MATCH (j:User)-[a:`has a`]-(b:VerificationToken) " + "WHERE j.email = $email " + "return b")
    Optional<VerificationToken> findVerificationToken(@Param("email")String email);

    @Query("match (n:User)-[:`has a`]-(v:VerificationToken) where v.token=$token return n")
    Optional<User>findByVerificationToken(@Param("token")String token);


}
