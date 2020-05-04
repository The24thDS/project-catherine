package com.example.demo.models.entities;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.neo4j.ogm.annotation.*;
import org.neo4j.ogm.annotation.typeconversion.DateString;
import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@NodeEntity
@NoArgsConstructor
@Getter
@Setter

public class  User {
    @Id
    @GeneratedValue

    private Long id;

    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;

    @NotBlank
    private String password;

    @NotBlank
    @Email
    private String email;

    private String roles;

    private Boolean enabled;
    @DateString("yyyy-MM-dd")
    private Date birthDate;

    private String profilePicture;

    @Relationship(type = "Has_a",direction = Relationship.OUTGOING)
    private VerificationToken verificationToken;

    @Relationship(type = "Posted")
    private Set<Post> posts=new HashSet<>();

    @Relationship(type= "Friends_With")
    private Set<User>friends=new HashSet<>();

    @Relationship(type="Pending_Friend_Request",direction = Relationship.OUTGOING)
    private Set<User>friendRequests=new HashSet<>();




}
