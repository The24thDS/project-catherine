package com.example.demo.exceptions;
import com.example.demo.models.payloads.responses.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

@EnableWebMvc
@ControllerAdvice
public class GlobalExceptionHandler extends ResponseEntityExceptionHandler {

    @ExceptionHandler
    public ResponseEntity<?> handleRegistrationException(UserRegistrationInvalidFieldsException ex){
        return new ResponseEntity<>(new ApiResponse("invalid fields: "+ex.getErrors(),false), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<?> handleInvalidTokenException(io.jsonwebtoken.SignatureException e){
        return new ResponseEntity<>(new ApiResponse(e.getMessage(),false), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<?> handleExpiredTokenException(io.jsonwebtoken.ExpiredJwtException e){
        return new ResponseEntity<>(new ApiResponse(e.getMessage(),false), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler
    public ResponseEntity<?> handleDisabledAccountException(org.springframework.security.authentication.DisabledException e){
        return new ResponseEntity<>(new ApiResponse("Account is not enabled",false), HttpStatus.BAD_REQUEST);

    }
    @ExceptionHandler
    public ResponseEntity<?> handlePhotoOfWrongFormat(InvalidPhotoException e){
        return new ResponseEntity<>(new ApiResponse(e.getMessage(),false), HttpStatus.BAD_REQUEST);

    }



}
