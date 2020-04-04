package com.example.demo.controllers;
import com.example.demo.appPrincipal.MyUserDetailsService;
import com.example.demo.exceptions.UserRegistrationInvalidFieldsException;
import com.example.demo.models.entities.User;
import com.example.demo.models.entities.VerificationToken;
import com.example.demo.models.payloads.*;
import com.example.demo.repositories.UserRepository;
import com.example.demo.security.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.MailParseException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import javax.validation.Valid;
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
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JavaMailSender javaMailSender;

    @PostMapping("/register")
    @ResponseBody
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest, BindingResult bindingResult){
        if(bindingResult.hasErrors()){
            ArrayList<String>stringErrors=new ArrayList<>();
            List<FieldError> errors= bindingResult.getFieldErrors();
            for (FieldError fieldError : errors) {
                String error = fieldError.getField();
                if (!stringErrors.contains(error)) {
                    stringErrors.add(error);
                }
            }

            throw new UserRegistrationInvalidFieldsException(stringErrors);
        }
        if(userRepository.existsByEmail(registerRequest.getEmail())){
            ApiResponse userRegistrationResponse=new ApiResponse("email Already taken",false);
            return new ResponseEntity<>(userRegistrationResponse, HttpStatus.BAD_REQUEST);
        }
        User user=new User();
        user.setEmail(registerRequest.getEmail());
        user.setPassword(passwordEncoder.encode(registerRequest.getPassword()));
        user.setEnabled(false);
        user.setRoles("ROLE_USER");
        user.setFirst_name(registerRequest.getFirst_name());
        user.setLast_name(registerRequest.getLast_name());
        user.setBirth_date(registerRequest.getBirth_date());
        VerificationToken verificationToken=new VerificationToken();
        String token=UUID.randomUUID().toString();
        verificationToken.setToken(token);
       user.setVerificationToken( verificationToken);
       userRepository.save(user);

        MimeMessage message =javaMailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, false, "utf-8");
            String htmlMsg = "<body style='border:2px solid black'>"
                    +"<h1>Your onetime password for registration is : </h1><h2>"+verificationToken.getToken()+"</h2>"
                    + "Please use this OTP to complete your new user registration."+
                    "OTP is confidential, do not share this  with anyone." +
                    "</body>";
            message.setContent(htmlMsg, "text/html");
            helper.setTo(registerRequest.getEmail());
            helper.setSubject("Account Registration");
            javaMailSender.send(message);
        } catch (MessagingException e) {
            throw new MailParseException(e);
        }
        return new ResponseEntity<>(new ApiResponse("account created successfully",true), HttpStatus.CREATED);

    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@Valid @RequestBody LoginRequest loginRequest) throws Exception {

        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getUser()
                            , loginRequest.getPassword())

            );

        }
        catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(new BadCredentialsResponse("bad credentials"));
        }
        final UserDetails userDetails = myUserDetailsService.loadUserByUsername(loginRequest.getUser());
        final String jwt = jwtTokenUtil.generateToken(userDetails);
        return ResponseEntity.status(HttpStatus.OK).body(new ApiResponse(jwt,true));
    }


    @PostMapping("/verifyToken")
    public ResponseEntity<?> verifyToken(@RequestBody AvailabilityRequest availabilityRequest){
        String jwt=availabilityRequest.getInput();
        String username=jwtTokenUtil.extractUsername(jwt);
        UserDetails userDetails = this.myUserDetailsService.loadUserByUsername(username);
        if(jwtTokenUtil.validateToken(jwt,userDetails)){
            return new ResponseEntity<>(new ApiResponse("token is valid",true), HttpStatus.OK);
        }
        else return new ResponseEntity<>(new ApiResponse("token is invalid",false), HttpStatus.BAD_REQUEST);
    }

    @PostMapping("/enableAccount")
    public ResponseEntity<?>enableAccount(@RequestBody EnableAccountRequest enableAccountRequest) {
        Optional<User> user = userRepository.findByEmail(enableAccountRequest.getUser());
        if (user.isPresent()) {
            Optional<VerificationToken> verificationToken = userRepository.findVerificationToken(user.get().getEmail());
            if(verificationToken.isPresent()) {
                if (verificationToken.get().getToken().equals(enableAccountRequest.getToken())) {
                    user.get().setEnabled(true);
                    userRepository.save(user.get());
                    return new ResponseEntity<>(new ApiResponse("Account activated successfully", true), HttpStatus.OK);
                } else return new ResponseEntity<>(new ApiResponse("Token is invalid", false), HttpStatus.OK);
            }else return new ResponseEntity<>(new ApiResponse("A token for this account has not been created yet", false), HttpStatus.OK);
        }else return new ResponseEntity<>(new ApiResponse("Account with such username or email doesn't exist", false), HttpStatus.OK);

    }



}
