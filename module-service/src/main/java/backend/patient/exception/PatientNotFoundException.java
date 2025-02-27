package backend.patient.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class PatientNotFoundException extends RuntimeException{
    @Getter
    private final HttpStatus httpStatus;

    public PatientNotFoundException(String message, HttpStatus httpStatus) {
        super(message);
        this.httpStatus = httpStatus;
    }
}
