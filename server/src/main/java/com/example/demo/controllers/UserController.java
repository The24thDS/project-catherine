package com.example.demo.controllers;
import com.example.demo.appPrincipal.UserDetailsPrincipal;
import com.example.demo.models.entities.User;
import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import com.example.demo.models.payloads.requests.AvailabilityRequest;
import com.example.demo.models.payloads.requests.SearchRequest;
import com.example.demo.models.payloads.requests.UserUpdateRequest;
import com.example.demo.models.payloads.responses.*;
import com.example.demo.models.payloads.PayloadModels.FullUserDetails;
import com.example.demo.repositories.UserRepository;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.user.SimpUser;
import org.springframework.messaging.simp.user.SimpUserRegistry;
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
    @Autowired
    SimpUserRegistry simpUserRegistry;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    //updates user's details
    @RequestMapping("/update")
    public ResponseEntity<?> updateUserDetails(@Valid @RequestBody UserUpdateRequest userUpdateRequest,
                                               BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return new ResponseEntity<ApiResponse>(new ApiResponse(findErrors(bindingResult).toString(), false), HttpStatus.OK);
        } else {
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> user = userRepository.findByEmail(currentUser.getUsername(),0);
            if (user.isPresent()) {

                if (!user.get().getFirstName().equals(userUpdateRequest.getFirstName())&&userUpdateRequest.getFirstName()!=null)
                    user.get().setFirstName(userUpdateRequest.getFirstName());

                if (!user.get().getLastName().equals(userUpdateRequest.getLastName())&&userUpdateRequest.getLastName()!=null)
                    user.get().setLastName(userUpdateRequest.getLastName());

                if (!user.get().getEmail().equals(userUpdateRequest.getEmail())&&userUpdateRequest.getEmail()!=null)
                    user.get().setEmail(userUpdateRequest.getEmail());

                if (!user.get().getBirthDate().equals(userUpdateRequest.getBirthDate())&&userUpdateRequest.getBirthDate()!=null)
                    user.get().setBirthDate(userUpdateRequest.getBirthDate());
                if(userUpdateRequest.getProfilePicture()!=null&&userUpdateRequest.getProfilePicture().length()>50) {
                    user.get().setProfilePicture(userUpdateRequest.getProfilePicture());
                }
                if(userUpdateRequest.getPassword()!=null && userUpdateRequest.getPassword2()!=null) {
                    if (!(passwordEncoder.matches(userUpdateRequest.getPassword(), user.get().getPassword()))) {
                        if (passwordEncoder.matches(userUpdateRequest.getPassword2(), user.get().getPassword())) {
                            user.get().setPassword(passwordEncoder.encode(userUpdateRequest.getPassword()));
                        } else
                            return new ResponseEntity<ApiResponse>(new ApiResponse("Old password is incorrect", false), HttpStatus.OK);
                    } else
                        return new ResponseEntity<ApiResponse>(new ApiResponse("Can't have the same password", false), HttpStatus.OK);
                }else if(userUpdateRequest.getPassword()==null&&userUpdateRequest.getPassword2()!=null) return new ResponseEntity<ApiResponse>(new ApiResponse("Should include old password too", false), HttpStatus.OK);
                else if(userUpdateRequest.getPassword()!=null&&userUpdateRequest.getPassword2()==null) return new ResponseEntity<ApiResponse>(new ApiResponse("Should include new password too", false), HttpStatus.OK);
                userRepository.save(user.get());
                return new ResponseEntity<ApiResponse>(new ApiResponse("Updated Successfully", true), HttpStatus.OK);
            } else
                return new ResponseEntity<ApiResponse>(new ApiResponse("Couldn't find a user with that email", false), HttpStatus.OK);
        }
    }

    @GetMapping("/details")
    public ResponseEntity<?> getUserDetails(@RequestParam(value = "user",required = false)Long id) {
        FullUserDetailsResponse fullUserDetailsResponse=null;
        CustomUserDetailsResponse customUserDetailsResponse=null;
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(), 0);
        if (principal.isPresent()) {
            if (id != null) {
                Optional<User> requestedUser = userRepository.findById(id, 0);
                if (requestedUser.isPresent()) {
                    SimpUser simpUser= simpUserRegistry.getUser(requestedUser.get().getEmail());
                    boolean online= simpUser != null;
                    if (userRepository.isFriendsWith(principal.get().getId(), requestedUser.get().getId())) {
                        User user = requestedUser.get();
                        FullUserDetails fullUserDetails=new FullUserDetails(user.getEmail(), user.getFirstName(), user.getLastName(),
                                formatter.format(user.getBirthDate()), user.getId(), user.getProfilePicture());

                        fullUserDetailsResponse=new FullUserDetailsResponse(fullUserDetails,online);
                        fullUserDetailsResponse.setMessage("Friend Details");
                        fullUserDetailsResponse.setSuccess(true);
                    } else {
                        User user = requestedUser.get();
                        CustomUserDetails customUserDetails=new CustomUserDetails(user.getId(),user.getFirstName(),user.getLastName(),user.getProfilePicture());
                        customUserDetailsResponse = new CustomUserDetailsResponse(customUserDetails,online);
                        customUserDetailsResponse.setMessage("User Details");
                        customUserDetailsResponse.setSuccess(true);

                    }
                } else return new ResponseEntity<ApiResponse>(new ApiResponse("User does not exist", false),HttpStatus.OK);
            } else {
                User user = principal.get();
                SimpUser simpUser= simpUserRegistry.getUser(user.getEmail());
                boolean online= simpUser != null;
                fullUserDetailsResponse = new FullUserDetailsResponse(new FullUserDetails(user.getEmail(), user.getFirstName(), user.getLastName(),
                        formatter.format(user.getBirthDate()), user.getId(), user.getProfilePicture()),online);
                fullUserDetailsResponse.setSuccess(true);
                fullUserDetailsResponse.setMessage("Authenticated User details");

            }if(!(fullUserDetailsResponse==null)) return new ResponseEntity<>(fullUserDetailsResponse,HttpStatus.OK);
            else return new ResponseEntity<>(customUserDetailsResponse,HttpStatus.OK);
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
        Optional<User> senderUser = userRepository.findByEmail(currentUser.getUsername(),1);
        Optional<User> recieverUser = userRepository.findById(id);
        if (senderUser.isPresent() && recieverUser.isPresent()) {
            if(!recieverUser.get().getFriends().contains(senderUser.get())) {
                recieverUser.get().getFriendRequests().add(senderUser.get());
                userRepository.save(recieverUser.get());
                SimpUser simpUser= simpUserRegistry.getUser(recieverUser.get().getEmail());
                if(simpUser!=null)
                    simpMessagingTemplate.convertAndSendToUser(simpUser.getName(),"/queue/notification", new FriendNotificationMessage(currentUser.getId(), "SENT"));
                return new ResponseEntity<>(new ApiResponse("Friend Request Sent", true), HttpStatus.OK);
            } else return new ResponseEntity<>(new ApiResponse("User is already In your friends list", false), HttpStatus.OK);
        } else return new ResponseEntity<>(new ApiResponse("Couldn't find user with given id", false), HttpStatus.OK);

    }

    @PostMapping("/refuseFriendRequest/{id}")
    ResponseEntity<?> refuseFriendRequest(@PathVariable("id") Long id) {
        ApiResponse apiResponse = new ApiResponse();
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),1);
        Optional<User> friendRequestUser = userRepository.findById(id);
        if (principal.isPresent() && friendRequestUser.isPresent()) {
            if (principal.get().getFriendRequests().contains(friendRequestUser.get())) {
                //remove from the pending list
                principal.get().getFriendRequests().remove(friendRequestUser.get());
                userRepository.save(principal.get());
                apiResponse.setMessage("Friend request refused");
                apiResponse.setSuccess(true);
            }else {
                apiResponse.setMessage("There is no such friend request to be refused");
                apiResponse.setSuccess(false);
            }
        } else {
            apiResponse.setSuccess(false);
            apiResponse.setMessage("Error. Requested user doesn't exist");

        }
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }



    @DeleteMapping("/friends/{id}")
    ResponseEntity<?> deleteRequest(@PathVariable("id") Long id) {
        ApiResponse apiResponse = new ApiResponse();
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),1);
        Optional<User> friendToDelete= userRepository.findById(id);
        if (principal.isPresent() && friendToDelete.isPresent()) {
            if (principal.get().getFriends().contains(friendToDelete.get())) {
                //remove
                principal.get().getFriends().remove(friendToDelete.get());
                friendToDelete.get().getFriends().remove(principal.get());
                userRepository.save(principal.get());
                userRepository.save(friendToDelete.get());

                apiResponse.setMessage("Friend has been deleted from your friend list");
                apiResponse.setSuccess(true);
            }else {
                //Id in the path variable is not present in the pending list
                apiResponse.setMessage("There is no such friend to be deleted");
                apiResponse.setSuccess(false);
            }
            } else {
                apiResponse.setSuccess(false);
                apiResponse.setMessage("Error. Requested user doesn't exist");

            }
            return new ResponseEntity<>(apiResponse, HttpStatus.OK);
    }

    @PostMapping("/acceptFriendRequest/{id}")
    ResponseEntity<?> acceptFriendRequest(@PathVariable("id") Long id) {
        ApiResponse apiResponse = new ApiResponse();
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),1);
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
                SimpUser simpUser= simpUserRegistry.getUser(friendRequestUser.get().getEmail());
                if(simpUser!=null)
                    simpMessagingTemplate.convertAndSendToUser(simpUser.getName(),"/queue/notification", new FriendNotificationMessage(currentUser.getId(), "ACCEPTED"));
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


    @GetMapping("/friendRequests")
    ResponseEntity<?>getPending(){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),1);
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

    @GetMapping("/friends")
    ResponseEntity<?>getFriends(){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),1);
        HashSet<CustomUserResponse> responses=new HashSet<>();
        CustomFriendsResponse friendsResponse = new CustomFriendsResponse();
        if(principal.isPresent()) {
            for (User temp : principal.get().getFriends()) {
                SimpUser simpUser= simpUserRegistry.getUser(temp.getEmail());
                     boolean online= simpUser != null;
                friendsResponse.addUser(temp.getId(),temp.getFirstName(),temp.getLastName(),temp.getProfilePicture(),temp.getEmail(),online);
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



    @RequestMapping(value = "/search",method =RequestMethod.POST)
    ResponseEntity<?>search(@RequestBody SearchRequest searchRequest){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),0);
        ArrayList<User>list;
        if(searchRequest.getLastName()==null)searchRequest.setLastName(" ");
        if(searchRequest.getFirstName()==null)searchRequest.setFirstName(" ");
        if(!(searchRequest.getLastName().equals(" "))&&!(searchRequest.getFirstName().equals(" ")))
        {
        list=userRepository.findUserByFirstNameEqualsAndLastNameStartsWith(searchRequest.getFirstName(),searchRequest.getLastName());
        }else {
            list = userRepository.findUserByFirstNameStartsWith(searchRequest.getFirstName(), searchRequest.getLastName());
        }
        if(list.contains(principal.get())) list.remove(principal.get());
        CustomUserResponse customUserResponse=new CustomUserResponse();
        if(!list.isEmpty())
        for (User user:list) customUserResponse.addUser(user.getId(),user.getFirstName(),user.getLastName(),user.getProfilePicture());
        customUserResponse.setMessage("Search successful");
        customUserResponse.setSuccess(true);
        return new ResponseEntity<>(customUserResponse,HttpStatus.OK) ;

    }

    @Getter
    @Setter
    @AllArgsConstructor
    private static class FriendNotificationMessage{
        Long id;
        String type;
    }

}



