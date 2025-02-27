package backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class AuthUserNotFoundException extends RuntimeException{
    @Getter
    HttpStatus httpStatus;

    public AuthUserNotFoundException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
