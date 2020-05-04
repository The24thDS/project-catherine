package com.example.demo.controllers;
import com.example.demo.appPrincipal.UserDetailsPrincipal;
import com.example.demo.models.entities.User;
import com.example.demo.models.payloads.*;
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
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Optional;
import static com.example.demo.controllers.AuthController.findErrors;


@RestController
@RequestMapping("/api/v1/user")
public class UserController {
    @Autowired
    UserRepository userRepository;
    @Autowired
    PasswordEncoder passwordEncoder;

    //updates user's details
    @RequestMapping("/update")
    public ResponseEntity<?> updateUserDetails(@Valid @RequestBody UserUpdateRequest userUpdateRequest,
                                               BindingResult bindingResult) {

        if (bindingResult.hasErrors()) {
            return new ResponseEntity<ApiResponse>(new ApiResponse(findErrors(bindingResult).toString(), false), HttpStatus.OK);
        } else {
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> user = userRepository.findByEmail(currentUser.getUsername());
            if (user.isPresent()) {

                if (!user.get().getFirstName().equals(userUpdateRequest.getFirstName()))
                    user.get().setFirstName(userUpdateRequest.getFirstName());

                if (!user.get().getLastName().equals(userUpdateRequest.getLastName()))
                    user.get().setLastName(userUpdateRequest.getLastName());

                if (!user.get().getEmail().equals(userUpdateRequest.getEmail()))
                    user.get().setEmail(userUpdateRequest.getEmail());

                if (!user.get().getBirthDate().equals(userUpdateRequest.getBirthDate()))
                    user.get().setBirthDate(userUpdateRequest.getBirthDate());

                if (!(passwordEncoder.matches(userUpdateRequest.getPassword(), user.get().getPassword()))) {
                    if (passwordEncoder.matches(userUpdateRequest.getPassword2(), user.get().getPassword())) {
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
    //gets the details of currently logged in user
    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails() {
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> user = userRepository.findByEmail(currentUser.getUsername());
        if (user.isPresent()) {
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
            UserDetailsResponse userDetailsResponse = new UserDetailsResponse();
            userDetailsResponse.setSuccess(true);
            userDetailsResponse.setEmail(user.get().getEmail());
            userDetailsResponse.setLastName(user.get().getLastName());
            userDetailsResponse.setFirstName(user.get().getFirstName());
            userDetailsResponse.setBirthDate(formatter.format(user.get().getBirthDate()));
            userDetailsResponse.setId(user.get().getId());
            userDetailsResponse.setProfilePicture(user.get().getProfilePicture());
            return new ResponseEntity<UserDetailsResponse>(userDetailsResponse, HttpStatus.OK);
        } else return new ResponseEntity<>(new ApiResponse("Error. Couldn't load user", false), HttpStatus.NOT_FOUND);
    }

    @PostMapping("/checkEmailAvailability")
    public ResponseEntity<ApiResponse> checkEmailAvailability(@RequestBody AvailabilityRequest input) {
        String email = input.getInput();
        boolean emailAvailable = !(userRepository.existsByEmail(email));
        String message;
        ApiResponse apiResponse = new ApiResponse();

        if (emailAvailable) {
            apiResponse.setMessage("Email Is available");
            apiResponse.setSuccess(true);
        } else {
            apiResponse.setSuccess(false);
            apiResponse.setMessage("Email is Taken");
        }
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/sendFriendRequest/{id}")
    ResponseEntity<?> sendFriendRequest(@PathVariable("id") Long id) {
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> senderUser = userRepository.findByEmail(currentUser.getUsername());
        Optional<User> recieverUser = userRepository.findById(id);

        if (senderUser.isPresent() && recieverUser.isPresent()) {
            recieverUser.get().getFriendRequests().add(senderUser.get());
            userRepository.save(recieverUser.get());
            return new ResponseEntity<>(new ApiResponse("Friend Request Sent", true), HttpStatus.OK);

        } else return new ResponseEntity<>(new ApiResponse("Couldn't find user with given id", false), HttpStatus.OK);

    }


    @PostMapping("/acceptFriendRequest/{id}")
    ResponseEntity<?> acceptFriendRequest(@PathVariable("id") Long id) {
        ApiResponse apiResponse = new ApiResponse();
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername());
        Optional<User> friendRequestUser = userRepository.findById(id);
        if (principal.isPresent() && friendRequestUser.isPresent()) {
            if (principal.get().getFriendRequests().contains(friendRequestUser.get())) {
                //remove from the pending list
                principal.get().getFriendRequests().remove(friendRequestUser.get());
                //add bidirectional relationship
                principal.get().getFriends().add(friendRequestUser.get());
                friendRequestUser.get().getFriends().add(principal.get());

                userRepository.save(principal.get());
                userRepository.save(friendRequestUser.get());

                apiResponse.setMessage("Friend has been added to your friend list");
                apiResponse.setSuccess(true);
            }else {
                //Id in the path variable is not present in the pending list
                apiResponse.setMessage("There is no such friend request to be accepted");
                apiResponse.setSuccess(false);
            }
            } else {
                apiResponse.setSuccess(false);
                apiResponse.setMessage("Error. Requested user doesn't exist");

            }
            return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @GetMapping("/getAllPendingFriendRequests")
    ResponseEntity<?>getPending(){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername());
        HashSet<CustomUserResponse> responses=new HashSet<>();
        CustomUserResponse friendsResponse = new CustomUserResponse();
        if(principal.isPresent()) {
            for (User temp : principal.get().getFriendRequests()) {
                //method to add a new  inner class instance :user, to the hashset field
                friendsResponse.addUser(temp.getId(),temp.getFirstName(),temp.getLastName(),temp.getProfilePicture());
            }
            friendsResponse.setMessage("Pending Friends Requests Fetched Successfully");
            friendsResponse.setSuccess(true);
        }
        else {
            friendsResponse.setSuccess(false);
            friendsResponse.setMessage("Error. Couldn't fetch data");
        }
        return new ResponseEntity<>(friendsResponse,HttpStatus.OK);


    }

    @GetMapping("/getAllFriends")
    ResponseEntity<?>getFriends(){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername());
        HashSet<CustomUserResponse> responses=new HashSet<>();
        CustomUserResponse friendsResponse = new CustomUserResponse();
        if(principal.isPresent()) {
            for (User temp : principal.get().getFriends()) {
                friendsResponse.addUser(temp.getId(),temp.getFirstName(),temp.getLastName(),temp.getProfilePicture());
            }
            friendsResponse.setMessage("Friends Fetched Successfully");
            friendsResponse.setSuccess(true);
        }
        else {
            friendsResponse.setSuccess(false);
            friendsResponse.setMessage("Error. Couldn't fetch data");
        }
        return new ResponseEntity<>(friendsResponse,HttpStatus.OK);
    }


    @RequestMapping(value = "/search",method =RequestMethod.GET)
    ResponseEntity<?>search(@RequestBody SearchRequest searchRequest){
        System.out.println(searchRequest.getLastName()+searchRequest.getFirstName());

        if(searchRequest.getLastName()==null)searchRequest.setLastName(" ");
        if(searchRequest.getFirstName()==null)searchRequest.setFirstName(" ");
        ArrayList<User>list=userRepository.findUserByFirstNameStartsWith(searchRequest.getFirstName(),searchRequest.getLastName());
        CustomUserResponse customUserResponse=new CustomUserResponse();
        if(!list.isEmpty())
        for (User user:list) customUserResponse.addUser(user.getId(),user.getFirstName(),user.getLastName(),user.getProfilePicture());
        customUserResponse.setMessage("Search successful");
        customUserResponse.setSuccess(true);
        return new ResponseEntity<>(customUserResponse,HttpStatus.OK) ;

    }







    }



