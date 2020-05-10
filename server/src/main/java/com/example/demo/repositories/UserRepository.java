package com.example.demo.repositories;
import com.example.demo.models.entities.User;
import org.springframework.data.neo4j.annotation.Depth;
import org.springframework.data.neo4j.annotation.Query;
import org.springframework.data.neo4j.annotation.QueryResult;
import org.springframework.data.neo4j.repository.Neo4jRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.ArrayList;
import java.util.Optional;

@Repository
public interface UserRepository extends Neo4jRepository<User,Long> {
    Optional<User> findByEmail(String email,@Depth int depth);
    boolean existsByEmail(String email);

    Optional<User>findById(Long id, @Depth int depth);

    @Query("match (u:User)-[h:Has_a]-(v:VerificationToken) where v.token=$token return u")
    Optional<User>findByVerificationToken(@Param("token")String token);

    @Query("match (u:User) where toLower(u.firstName) STARTS with toLower($firstName) or toLower(u.lastName) starts with toLower($lastName) return u")
    ArrayList<User> findUserByFirstNameStartsWith(@Param("firstName")String firstName, @Param("lastName")String lastName);

    @Query("match (u:User) where toLower(u.firstName)=toLower($firstName) and toLower(u.lastName) starts with toLower($lastName) return u")
    ArrayList<User> findUserByFirstNameEqualsAndLastNameStartsWith(@Param("firstName")String firstName, @Param("lastName")String lastName);
    @Query("match (u:User)-[f:Friends_With]->(u1:User) where id(u)=$principalId and id(u1)=$requestedUserId return CASE WHEN count(u1)=1 THEN true ELSE false END")
    boolean isFriendsWith(@Param("principalId")Long principalId,@Param("requestedUserId")Long requestedUserId);


}
