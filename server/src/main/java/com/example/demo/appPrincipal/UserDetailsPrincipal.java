package com.example.demo.appPrincipal;
import com.example.demo.models.entities.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Arrays;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

public class UserDetailsPrincipal implements UserDetails {
    private Long id;
    private String first_name;
    private String last_name;
    private String password;
    private String email;
    private boolean enabled;
    private Date birth_date;
    private List<GrantedAuthority> authorityList;


    public UserDetailsPrincipal(User user) {
        this.first_name=user.getFirst_name();
        this.last_name=user.getLast_name();
        this.email=user.getEmail();
        this.id=user.getId();
        this.password=user.getPassword();
        this.enabled=user.isEnabled();
        this.birth_date=user.getBirth_date();

        this.authorityList= Arrays.stream(user.getRoles().split(",")).map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
    }
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorityList;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return enabled;
    }

    public Long getId() {
        return id;
    }

    public String getFirst_name() {
        return first_name;
    }

    public String getLast_name() {
        return last_name;
    }

    public Date getBirth_date() {
        return birth_date;
    }
}

