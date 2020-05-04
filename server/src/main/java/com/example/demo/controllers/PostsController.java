package com.example.demo.controllers;
import com.example.demo.appPrincipal.UserDetailsPrincipal;
import com.example.demo.models.entities.Comment;
import com.example.demo.models.entities.Post;
import com.example.demo.models.entities.User;
import com.example.demo.models.payloads.ApiResponse;
import com.example.demo.models.payloads.CommentsResponse;
import com.example.demo.models.payloads.GetPostsResponse;
import com.example.demo.models.payloads.PayloadModels.CustomCommentDetails;
import com.example.demo.models.payloads.PayloadModels.CustomUserDetails;
import com.example.demo.models.payloads.queryResults.PostDetailsQueryResult;
import com.example.demo.repositories.CommentsRepository;
import com.example.demo.repositories.PostsRepository;
import com.example.demo.repositories.UserRepository;
import com.example.demo.services.PhotoService;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import javax.servlet.ServletContext;
import java.io.IOException;
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
    ResponseEntity<?> post(@RequestParam(value = "content", required = false) String content, @RequestParam(value = "image", required = false) MultipartFile image) throws IOException {
        ApiResponse apiResponse = new ApiResponse();
        //check request to contain either of the 2
        if (content != null || image != null) {
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> user = userRepository.findByEmail(currentUser.getUsername());
            //initialize
            if (user.isPresent()) {
                Post post = new Post();
                Date date = new Date();
                post.setDate(date);
                //in the case content is not null, save it
                if (content != null)
                    post.setContent(content);
                //in the case image is not null, save the details and upload it on server
                if (image != null) {
                    Map<String,String> response=new HashMap<>();
                    response=photoService.savePicture(image);
                    if(response.containsKey("imageName")){
                        post.setImageName(response.get("imageName"));
                    }
                    else if(response.containsKey("error")){
                        apiResponse.setMessage(response.get("error"));
                        apiResponse.setSuccess(false);
                        return new ResponseEntity<>(apiResponse,HttpStatus.OK);
                    }
                }
                //if it got till here, it means it's all good, save the post in database
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
        ResponseEntity<?>getPosts(@PathVariable("id") Long userId) {
        GetPostsResponse getPostsResponse=new GetPostsResponse();
        ArrayList<PostDetailsQueryResult>postDetailsQueryResults;
        postDetailsQueryResults=postsRepository.customFindPostsByUser(userId);
        if(postDetailsQueryResults.size()>0) {
            getPostsResponse.setMessage("Posts Fetched Successfully");
            getPostsResponse.setSuccess(true);
            getPostsResponse.setPosts(postDetailsQueryResults);
        }else {
            getPostsResponse.setMessage("User has no posts");
            getPostsResponse.setSuccess(false);
            getPostsResponse.setPosts(postDetailsQueryResults);
        }
      return new ResponseEntity<>(getPostsResponse,HttpStatus.OK);
    }




    @PostMapping("/{id}/like")
    ResponseEntity<?>likePost(@PathVariable("id")Long id){
        Optional<Post>post=postsRepository.findById(id);
        ApiResponse apiResponse=new ApiResponse();
        if(post.isPresent()){
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> principal = userRepository.findByEmail(currentUser.getUsername());
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

    @PostMapping("/{id}/unlike")
    ResponseEntity<?>unlikePost(@PathVariable("id")Long id){
        Optional<Post>post=postsRepository.findById(id);
        ApiResponse apiResponse=new ApiResponse();
        if(post.isPresent()){
            UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            Optional<User> principal = userRepository.findByEmail(currentUser.getUsername());
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

    @PostMapping("/{id}/delete")
        ResponseEntity<?>removePost(@PathVariable("id")Long id){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername());
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

    @PostMapping("/{id}/comment")
    ResponseEntity<?>comment(@PathVariable(value = "id") Long id,@RequestBody Map<String,Object> body){
        UserDetailsPrincipal currentUser = (UserDetailsPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        Optional<User> principal = userRepository.findByEmail(currentUser.getUsername());
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

    @GetMapping("/{id}/comment")
    ResponseEntity<?> getPostComments(@PathVariable("id")Long id) throws JsonProcessingException {
        List<Comment> comments = commentsRepository.findByPostId(id);
        CommentsResponse commentsResponse=new CommentsResponse();
        if (comments.size() > 0) {
            commentsResponse.setComments(new ArrayList<>());
            SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");
            for (Comment comment : comments) {
                CustomUserDetails customUserDetails=new CustomUserDetails(comment.getUser().getId(),comment.getUser().getFirstName(),comment.getUser().getLastName(),comment.getUser().getProfilePicture());
                CustomCommentDetails customCommentDetails=new CustomCommentDetails(formatter.format(comment.getDate()),comment.getText());
                commentsResponse.addCommentsData(customUserDetails,customCommentDetails);
            }
            commentsResponse.setSuccess(true);
            commentsResponse.setMessage("Comments fetched successfully");

        }else {
            commentsResponse.setMessage("There are no comments for this post");
            commentsResponse.setSuccess(false);
        }

        return new ResponseEntity<>(commentsResponse,HttpStatus.OK);
    }



}












