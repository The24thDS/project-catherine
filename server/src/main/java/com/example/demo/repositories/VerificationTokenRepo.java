package com.example.demo.repositories;

import com.example.demo.models.entities.VerificationToken;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VerificationTokenRepo extends Neo4jRepository<VerificationToken,Long> {
    Optional<VerificationToken>findByToken(String token);
    Long deleteVerificationTokenByToken(String token);
}
