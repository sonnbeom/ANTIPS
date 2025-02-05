package backend.common.domain;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ValidAuthResponse {
    private String message;
    private String userId;
}
