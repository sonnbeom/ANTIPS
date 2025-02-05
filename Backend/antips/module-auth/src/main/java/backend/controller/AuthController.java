package backend.controller;

import backend.common.domain.ValidAuthResponse;
import backend.common.response.CommonResponse;
import backend.jwt.dto.CustomUserDetails;
import backend.service.AuthService;
import backend.dto.requesst.LoginRequestDto;
import backend.dto.response.AuthResponse;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import static backend.constant.ConstantResponseMessage.*;

@RequestMapping("/api/v1/auth")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;

    @GetMapping("/validate")
    public ValidAuthResponse validateToken(@AuthenticationPrincipal CustomUserDetails customUserDetails){
        log.info("유효성 검증 컨트롤러 호출");;
        return ValidAuthResponse.builder().
                message(SUCCESS_MESSAGE).
                userId(String.valueOf(customUserDetails.getUSerId())).
                build();

    }
    @PostMapping("/login")
    public CommonResponse<AuthResponse> login(@RequestBody LoginRequestDto loginRequestDto){
        AuthResponse authResponse = authService.login(loginRequestDto);
        log.info("로그인 컨트롤러 호출");
        return CommonResponse.<AuthResponse>builder()
                .message(SUCCESS_MESSAGE)
                .status(200)
                .data(authResponse)
                .build();
    }
    @GetMapping("/private")
    public int welcome(){
        return 200;
    }
}
