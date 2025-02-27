package backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class UserNotFoundException extends RuntimeException{
    @Getter
    private final HttpStatus status;
    public UserNotFoundException(String message, HttpStatus status) {
        super(message);
        this.status =status;
    }

    public UserNotFoundException(String message, String email, HttpStatus status) {
        super(String.format(message, email));
        this.status = status;
    }

}
