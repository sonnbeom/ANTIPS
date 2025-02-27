package backend.exception;

import org.springframework.http.HttpStatus;

public class CustomMonoServerException extends RuntimeException{
    HttpStatus httpStatus;

    public CustomMonoServerException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
