package backend.dto.response;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
}
