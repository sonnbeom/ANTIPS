package backend.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

public class RefreshTokenReissueException extends RuntimeException{
    @Getter
    HttpStatus httpStatus;

    public RefreshTokenReissueException(String message, HttpStatus httpStatus) {
        super();
        this.httpStatus = httpStatus;
    }
}
