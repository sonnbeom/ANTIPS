package backend.controller;

import backend.service.AuthService;
import backend.dto.requesst.LoginRequestDto;
import backend.dto.response.AuthResponse;
import backend.user.response.CommonResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import static backend.constant.ConstantResponseMessage.*;

@RequestMapping("/api/v1/auth")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @GetMapping("/private/validate")
    public String validateToken(){
        AuthResponse authResponse = new AuthResponse();
        log.info("유효성 검증 컨트롤러 호출");;
        return SUCCESS_MESSAGE;
    }
    @PostMapping("/login")
    public ResponseEntity<CommonResponse<AuthResponse>> login(@RequestBody LoginRequestDto loginRequestDto){
        AuthResponse authResponse = authService.login(loginRequestDto);
        log.info("로그인 컨트롤러 호출");
        CommonResponse<AuthResponse> response = CommonResponse.<AuthResponse>builder()
                .status(200)
                .message(SUCCESS_MESSAGE)
                .data(authResponse)
                .build();
        return ResponseEntity.ok(response);
    }
    @GetMapping("/private")
    public int welcome(){
        return 200;
    }
}
