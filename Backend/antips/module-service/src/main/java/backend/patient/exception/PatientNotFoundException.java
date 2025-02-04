package backend.patient.exception;

import org.springframework.http.HttpStatus;

public class PatientNotFoundException extends RuntimeException{
    private final HttpStatus httpStatus;

    public PatientNotFoundException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
