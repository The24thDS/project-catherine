package com.example.demo.exceptions;
import java.util.ArrayList;

public class UserRegistrationInvalidFieldsException extends RuntimeException {
    private ArrayList<String>errors;

    public  UserRegistrationInvalidFieldsException(ArrayList<String>errors){
        this.errors=errors;
    }

    ArrayList<String> getErrors() {
        return errors;
    }


    public UserRegistrationInvalidFieldsException(String message) {
        super(message);
    }
    public UserRegistrationInvalidFieldsException() { }
    public UserRegistrationInvalidFieldsException(String message, Throwable cause) {
        super(message, cause);
    }
    public UserRegistrationInvalidFieldsException(Throwable cause) {
        super(cause);
    }
}
