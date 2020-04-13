package com.example.demo.controllers;

import com.example.demo.appPrincipal.UserDetailsPrincipal;
import com.example.demo.models.entities.User;
import com.example.demo.models.payloads.ApiResponse;
import com.example.demo.models.payloads.AvailabilityRequest;
import com.example.demo.models.payloads.UserDetailsResponse;
import com.example.demo.models.payloads.UserUpdateRequest;
import com.example.demo.repositories.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.text.SimpleDateFormat;
import java.util.Optional;

import static com.example.demo.controllers.AuthController.findErrors;


@RestController()
@RequestMapping("/api/v1/user")
public class UserController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    @RequestMapping("/update")
    public ResponseEntity<?> updateUserDetails(@Valid @RequestBody UserUpdateRequest userUpdateRequest,
                                               BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<ApiResponse>(new ApiResponse(findErrors(bindingResult).toString(), false), HttpStatus.OK);
        } else {
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> user = userRepository.findByEmail(currentUser.getUsername());
            if (user.isPresent()) {

                if (!user.get().getFirst_name().equals(userUpdateRequest.getFirst_name()))
                    user.get().setFirst_name(userUpdateRequest.getFirst_name());

                if (!user.get().getLast_name().equals(userUpdateRequest.getLast_name()))
                    user.get().setLast_name(userUpdateRequest.getLast_name());

                if (!user.get().getEmail().equals(userUpdateRequest.getEmail()))
                    user.get().setEmail(userUpdateRequest.getEmail());

                if (!user.get().getBirth_date().equals(userUpdateRequest.getBirth_date()))
                    user.get().setBirth_date(userUpdateRequest.getBirth_date());

                if (!(passwordEncoder.matches(userUpdateRequest.getPassword(),user.get().getPassword()))) {
                    if (passwordEncoder.matches(userUpdateRequest.getPassword2(),user.get().getPassword())) {
                        user.get().setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
                    } else
                        return new ResponseEntity<ApiResponse>(new ApiResponse("Old password is incorrect", false), HttpStatus.OK);
                } else
                    return new ResponseEntity<ApiResponse>(new ApiResponse("Can't have the same password", false), HttpStatus.OK);
                userRepository.save(user.get());
                return new ResponseEntity<ApiResponse>(new ApiResponse("Updated Successfully", true), HttpStatus.OK);
            } else
                return new ResponseEntity<ApiResponse>(new ApiResponse("Couldn't find a user with that email", false), HttpStatus.OK);
        }
    }

    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails() {
        UserDetailsPrincipal currentUser=(UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> user=userRepository.findByEmail(currentUser.getUsername());
        if(user.isPresent()){
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            UserDetailsResponse userDetailsResponse=new UserDetailsResponse();
            userDetailsResponse.setSuccess(true);
            userDetailsResponse.setEmail(user.get().getEmail());
            userDetailsResponse.setLast_name(user.get().getLast_name());
            userDetailsResponse.setFirst_name(user.get().getFirst_name());
            userDetailsResponse.setBirth_date(formatter.format(user.get().getBirth_date()).toString());
            return new ResponseEntity<UserDetailsResponse>(userDetailsResponse,HttpStatus.OK);
        }
        else return new ResponseEntity<>(new ApiResponse("Error. Couldn't load user",false),HttpStatus.NOT_FOUND);
    }

    @PostMapping("/checkEmailAvailability")
    public ResponseEntity<ApiResponse> checkEmailAvailability(@RequestBody AvailabilityRequest input) {
        String email =input.getInput();
        boolean emailAvailable=!(userRepository.existsByEmail(email));
        String message;
        ApiResponse apiResponse=new ApiResponse();

        if (emailAvailable){
            apiResponse.setMessage("Email Is available");
            apiResponse.setSuccess(true);
        }
            else{
                apiResponse.setSuccess(false);
                apiResponse.setMessage("Email is Taken");
        }
        return  new ResponseEntity<>(apiResponse,HttpStatus.OK);
    }
}
