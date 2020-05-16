package com.example.demo.controllers;
import com.example.demo.appPrincipal.MyUserDetailsService;
import com.example.demo.exceptions.UserRegistrationInvalidFieldsException;
import com.example.demo.models.entities.User;
import com.example.demo.models.entities.VerificationToken;
import com.example.demo.models.payloads.requests.AvailabilityRequest;
import com.example.demo.models.payloads.requests.EnableAccountRequest;
import com.example.demo.models.payloads.requests.LoginRequest;
import com.example.demo.models.payloads.requests.RegisterRequest;
import com.example.demo.models.payloads.responses.ApiResponse;
import com.example.demo.models.payloads.responses.BadCredentialsResponse;
import com.example.demo.repositories.UserRepository;
import com.example.demo.repositories.VerificationTokenRepo;
import com.example.demo.security.JwtUtil;
import com.sendgrid.Method;
import com.sendgrid.Request;
import com.sendgrid.Response;
import com.sendgrid.SendGrid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.io.IOException;
import java.util.*;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtTokenUtil;

    @Autowired
    private MyUserDetailsService myUserDetailsService;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    VerificationTokenRepo verificationTokenRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult){
        ApiResponse apiResponse=new ApiResponse();
        if(bindingResult.hasErrors()){
          ArrayList<String>stringErrors=findErrors(bindingResult);
            throw new UserRegistrationInvalidFieldsException(stringErrors);
        }
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            ApiResponse userRegistrationResponse = new ApiResponse("email Already taken", false);
            return new ResponseEntity<>(userRegistrationResponse, HttpStatus.BAD_REQUEST);
        }
        User user=new User();

        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEnabled(false);
        user.setRoles("ROLE_USER");
        user.setFirstName(registerRequest.getFirstName());
        user.setLastName(registerRequest.getLastName());
        user.setBirthDate(registerRequest.getBirthDate());
        user.setProfilePicture("user-default.jpg");
        VerificationToken verificationToken=new VerificationToken();
        String token=UUID.randomUUID().toString();
        verificationToken.setToken(token);
       user.setVerificationToken( verificationToken);
       userRepository.save(user);

        SendGrid sg = new SendGrid(sendGridApiKey);
        try {
            Request request = new Request();
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody("{" +
                    "\"from\": {\"email\": \"hello@project-catherine.wtf\", \"name\": \"Project Catherine\"}," +
                    "\"personalizations\":[{" +
                    "\"to\": [{\"email\": \"" + registerRequest.getEmail() + "\"}],"
                    + "\"dynamic_template_data\": {" +
                    "\"activation_token\": \"" + verificationToken.getToken() + "\"" +
                    "}}]," +
                    "\"template_id\": \"d-594fb91f070e41fdab678d9a50842324\"}");
            Response response = sg.api(request);

        } catch (IOException ex) {
            apiResponse.setSuccess(false);
            apiResponse.setMessage("Email was not sent");
            return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);
        }
        apiResponse.setMessage("Account created successfully");
        apiResponse.setSuccess(true);
        return new ResponseEntity<>(apiResponse, HttpStatus.CREATED);

    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@Valid @RequestBody LoginRequest loginRequest) throws Exception {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail()
                            , loginRequest.getPassword())

            );

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BadCredentialsResponse("bad credentials"));
        }
        final UserDetails userDetails = myUserDetailsService.loadUserByUsername(loginRequest.getEmail());
        final String jwt = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse(jwt, true));
    }


    @PostMapping("/verifyToken")
    public ResponseEntity<?> verifyToken(@RequestBody AvailabilityRequest availabilityRequest) {
        String jwt = availabilityRequest.getInput();
        String username = jwtTokenUtil.extractUsername(jwt);
        UserDetails userDetails = this.myUserDetailsService.loadUserByUsername(username);
        if (jwtTokenUtil.validateToken(jwt, userDetails)) {
            return new ResponseEntity<>(new ApiResponse("token is valid", true), HttpStatus.OK);
        } else return new ResponseEntity<>(new ApiResponse("token is invalid", false), HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/enableAccount")
    @Transactional
    public ResponseEntity<?> enableAccount(@RequestBody EnableAccountRequest enableAccountRequest) {
        Optional<User> user = userRepository.findByVerificationToken(enableAccountRequest.getToken());
        if (user.isPresent()) {
            verificationTokenRepo.deleteVerificationTokenByToken(enableAccountRequest.getToken());
            user.get().setEnabled(true);
            userRepository.save(user.get());
            return new ResponseEntity<>(new ApiResponse("Account activated successfully!", true), HttpStatus.OK);
        } else return new ResponseEntity<>(new ApiResponse("Error! Could not activate your account", true), HttpStatus.OK);
    }



static ArrayList<String> findErrors(BindingResult bindingResult){
    ArrayList<String>stringErrors=new ArrayList<>();
    List<FieldError> errors= bindingResult.getFieldErrors();
    ArrayList<String>errorMessage=new ArrayList<>();
    for (FieldError fieldError : errors) {
        String error = fieldError.getField();
        if (!stringErrors.contains(error)) {
            stringErrors.add(error);
            errorMessage.add(fieldError.getDefaultMessage());
        }
    }
    return  errorMessage;
}

}
