package com.example.demo.controllers;
import com.example.demo.appPrincipal.UserDetailsPrincipal;
import com.example.demo.models.entities.Comment;
import com.example.demo.models.entities.Post;
import com.example.demo.models.entities.User;
import com.example.demo.models.payloads.queryResults.FriendsPostDetailsQueryResult;
import com.example.demo.models.payloads.responses.*;
import com.example.demo.models.payloads.PayloadModels.CustomCommentDetails;
import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import com.example.demo.models.payloads.requests.PostRequest;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
import com.example.demo.repositories.CommentsRepository;
import com.example.demo.repositories.PostsRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.PhotoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.Sort;
import org.springframework.data.repository.query.Param;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import javax.servlet.ServletContext;
import java.text.SimpleDateFormat;
import java.util.*;

@RestController
@RequestMapping("/api/v1/posts")
public class PostsController {

    @Autowired
    UserRepository userRepository;
    @Autowired
    ServletContext context;
    @Autowired
    PostsRepository postsRepository;
    @Autowired
    PhotoService photoService;
    @Autowired
    CommentsRepository commentsRepository;



    //can post both post content (text), and image.None is compulsory, but must contain at least 1 of them.
    @PostMapping()
    ResponseEntity<?> post(@RequestBody PostRequest postRequest)  {
        ApiResponse apiResponse = new ApiResponse();
        //check request to contain either of the 2
        if (postRequest.getContent() != null || postRequest.getPhotos() != null) {
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> user = userRepository.findByEmail(currentUser.getUsername(),0);
            //initialize
            if (user.isPresent()) {
                Post post = new Post();
                Date date = new Date();
                post.setDate(date);
                //in the case content is not null, save it
                if (postRequest.getContent() != null)
                    post.setContent(postRequest.getContent());
                if(postRequest.getPhotos()!=null && postRequest.getPhotos().size()>0){
                    for (String element:postRequest.getPhotos()) {
                        post.getImageNames().add(element);
                    }
                }
                user.get().getPosts().add(post);
                userRepository.save(user.get());

                apiResponse.setMessage("Post added successfully");
                apiResponse.setSuccess(true);
            }
            //handle that case when, for some reason, user couldn't be loaded from db. (poor chance to happen)
            else {
                apiResponse.setSuccess(false);
                apiResponse.setMessage("User not found");
            }
            //it gets here if both image and content are empty
        } else {
            apiResponse.setSuccess(false);
            apiResponse.setMessage("Must contain either Text, Image or both");
        }
        return new ResponseEntity<>(apiResponse, HttpStatus.OK);

    }

    @GetMapping("/user/{id}")
    ResponseEntity<?>getPosts(@RequestParam("page")Integer pageNumber ,@PathVariable("id") Long userId) {
        HttpStatus httpStatus;
        GetPostsResponse response=new GetPostsResponse();
        Slice<PostDetailsQueryResult> list=postsRepository.customFindPostsByUser(userId,PageRequest.of(pageNumber,25,Sort.by("date").descending()));
        if (!list.isEmpty()) {
            response.map(list);
            httpStatus=HttpStatus.OK;
        }else{
            response.setEmpty(list.isEmpty());response.setLast(list.isLast());
            httpStatus=HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(response,httpStatus);
    }

    @GetMapping("/{id}/like")
    ResponseEntity<?>getLikes(@RequestParam("page")Integer pageNumber,@PathVariable("id")Long id){
        UserLikesResponse response=new UserLikesResponse();
    Slice<CustomUserDetails>list=postsRepository.findUsersThatLikedPost(id,PageRequest.of(pageNumber,20,Sort.by("firstName").descending()));
        if (!list.isEmpty()) {
            response.map(list);
        }else{response.setEmpty(list.isEmpty());response.setLast(list.isLast());}
      return new ResponseEntity<>(response,HttpStatus.OK);
    }

    @PostMapping("/{id}/like")
    ResponseEntity<?>likePost(@PathVariable("id")Long id){
        Optional<Post>post=postsRepository.findById(id);
        ApiResponse apiResponse=new ApiResponse();
        if(post.isPresent()){
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),0);
            post.get().getUserLikes().add(principal.get());
            postsRepository.save(post.get());
            apiResponse.setMessage("Liked successfully");
            apiResponse.setSuccess(true);
        }
        else {
            apiResponse.setMessage("Could not find post");
            apiResponse.setSuccess(false);
        }
        return new ResponseEntity<>(apiResponse,HttpStatus.OK);
    }

    @DeleteMapping("/{id}/like")
    ResponseEntity<?>unlikePost(@PathVariable("id")Long id){
        Optional<Post>post=postsRepository.findById(id);
        ApiResponse apiResponse=new ApiResponse();
        if(post.isPresent()){
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),0);
            post.get().getUserLikes().remove(principal.get());
            postsRepository.save(post.get());
            apiResponse.setMessage("Unliked successfully");
            apiResponse.setSuccess(true);
        }
        else {
            apiResponse.setMessage("Could not find post");
            apiResponse.setSuccess(false);
        }
        return new ResponseEntity<>(apiResponse,HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
        ResponseEntity<?>removePost(@PathVariable("id")Long id){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),1);
        Optional<Post> post=postsRepository.findById(id);
        ApiResponse apiResponse=new ApiResponse();
        if (principal.isPresent()){
            User user=principal.get();
            if(post.isPresent()){
            if(user.getPosts().contains(post.get())){
                user.getPosts().remove(post.get());
                userRepository.save(user);
                postsRepository.delete(post.get());
                apiResponse.setSuccess(true);
                apiResponse.setMessage("Successfully deleted");
            }else {
                apiResponse.setSuccess(false);
                apiResponse.setMessage("User does not have such post");
            }
        }else{
                apiResponse.setSuccess(false);
                apiResponse.setMessage("Post not found");
            }
        }
        return new ResponseEntity<>(apiResponse,HttpStatus.OK);
    }

    @PostMapping("/{id}/comments")
    ResponseEntity<?>comment(@PathVariable(value = "id") Long id,@RequestBody Map<String,Object> body){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),0);
        Optional<Post> post=postsRepository.findById(id);
        ApiResponse apiResponse=new ApiResponse();
        if(post.isPresent()){
            if(principal.isPresent()){
            Comment comment=new Comment();
            comment.setDate(new Date());
            comment.setText(body.get("text").toString());
            comment.setPost(post.get());
            comment.setUser(principal.get());
            post.get().getComments().add(comment);
            postsRepository.save(post.get());
            apiResponse.setSuccess(true);
            apiResponse.setMessage("Comment added successfully");
        }
        }else {
            apiResponse.setMessage("Post not found");
            apiResponse.setSuccess(false);
        }
        return new ResponseEntity<>(apiResponse,HttpStatus.OK);
    }

    @GetMapping("/{id}/comments")
    ResponseEntity<?> getPostComments(@RequestParam("page")Integer pageNumber,@PathVariable("id")Long id){
        Slice<Comment> comments = commentsRepository.findByPostId(id,PageRequest.of(pageNumber,20,Sort.by("c.date").descending()));
       CommentsResponse commentsResponse=new CommentsResponse();
        if (!comments.isEmpty()) {
           commentsResponse.setComments(new ArrayList<>());
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            for (Comment comment : comments) {
               CustomUserDetails customUserDetails=new CustomUserDetails(comment.getUser().getId(),comment.getUser().getFirstName(),comment.getUser().getLastName(),comment.getUser().getProfilePicture());
                CustomCommentDetails customCommentDetails=new CustomCommentDetails(formatter.format(comment.getDate()),comment.getText());
                commentsResponse.addCommentsData(customUserDetails,customCommentDetails);
            }
            commentsResponse.setLast(comments.isLast());
            commentsResponse.setEmpty(comments.isEmpty());

        }else {
            commentsResponse.setEmpty(comments.isEmpty());commentsResponse.setLast(comments.isLast());
        }

        return new ResponseEntity<>(commentsResponse,HttpStatus.OK);


    }

    @GetMapping()
    ResponseEntity<?>friendsPosts(@RequestParam("page") Integer pageNumber){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername(),0);
        PostsOfFriendsResponse response=new PostsOfFriendsResponse();
        HttpStatus httpStatus;
        if(principal.isPresent()) {
            Slice<FriendsPostDetailsQueryResult> list = postsRepository.customFindFriendsPosts(principal.get().getId(), PageRequest.of(pageNumber,25,Sort.by("date").descending()));
           if (!list.isEmpty()) {
               response.map(list,postsRepository,principal.get().getId());
           }else{response.setEmpty(list.isEmpty());response.setLast(list.isLast());}
              httpStatus=HttpStatus.OK;
        }else{
            httpStatus=HttpStatus.NOT_FOUND;
        }
        return new ResponseEntity<>(response,httpStatus);
    }





}












