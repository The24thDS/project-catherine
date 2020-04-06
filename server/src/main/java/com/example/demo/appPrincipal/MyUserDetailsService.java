package com.example.demo.appPrincipal;
import com.example.demo.models.entities.User;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class MyUserDetailsService implements UserDetailsService {

    @Autowired
    UserRepository userRepository;


    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        System.out.println("before method");
        Optional<User> user= userRepository.findByEmail(email);
        user.orElseThrow(()->new UsernameNotFoundException("User not found with email : "+email));
        System.out.println("user found: "+user.get().getEmail()+" "+user.get().getFirst_name());
        return user.map(UserDetailsPrincipal::new).get();

    }

}