package backend.exception;

import org.springframework.http.HttpStatus;

public class AuthUserNotFoundException extends RuntimeException{
    HttpStatus httpStatus;

    public AuthUserNotFoundException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
