package backend.emergency.exception;

import org.springframework.http.HttpStatus;

public class EmergencyNotFoundException extends RuntimeException{
    private final HttpStatus httpStatus;

    public EmergencyNotFoundException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
