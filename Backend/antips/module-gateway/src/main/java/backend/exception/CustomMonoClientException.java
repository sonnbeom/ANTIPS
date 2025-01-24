package backend.exception;

import org.springframework.http.HttpStatus;

public class CustomMonoClientException extends RuntimeException{
    HttpStatus httpStatus;

    public CustomMonoClientException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
