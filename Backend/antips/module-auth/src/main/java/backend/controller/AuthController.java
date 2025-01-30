package backend.controller;

import backend.dto.response.AuthResponse;
import backend.member.response.CommonResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class AuthController {
    @GetMapping("/validate")
    public ResponseEntity<CommonResponse<AuthResponse>> validateToken(){
        AuthResponse authResponse = new AuthResponse();

        CommonResponse<AuthResponse> response = CommonResponse.<AuthResponse>builder()
                .status(200)
                .message("VALID")
                .data(authResponse)
                .build();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/welcome")
    public String welcome(){

        return "Welcome to the First service.";
    }
}
