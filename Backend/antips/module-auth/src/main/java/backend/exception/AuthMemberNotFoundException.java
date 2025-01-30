package backend.exception;

import org.springframework.http.HttpStatus;

public class AuthMemberNotFoundException extends RuntimeException{
    HttpStatus httpStatus;

    public AuthMemberNotFoundException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
