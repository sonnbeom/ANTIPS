package backend.dto.requesst;

import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
public class LoginRequestDto {
    private String employeeNumber;
    private String name;
    private String password;
}
