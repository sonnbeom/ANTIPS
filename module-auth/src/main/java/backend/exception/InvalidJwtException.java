package backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class InvalidJwtException extends RuntimeException{
    @Getter
    private final HttpStatus status;

    public InvalidJwtException(String message, Throwable cause, HttpStatus status) {
        super(message, cause);
        this.status = status;
    }
}
