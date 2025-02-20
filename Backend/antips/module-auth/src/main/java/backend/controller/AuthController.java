package backend.controller;

import backend.common.domain.ValidAuthResponse;
import backend.common.mapper.RefreshCookieMapper;
import backend.common.response.CommonResponse;
import backend.jwt.dto.CustomUserDetails;
import backend.service.AuthService;
import backend.dto.requesst.LoginRequestDto;
import backend.dto.response.AuthResponse;

import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Optional;

import static backend.constant.ConstantHeader.BEARER;
import static backend.constant.ConstantResponseMessage.*;
import static com.google.common.net.HttpHeaders.AUTHORIZATION;

@RequestMapping("/api/v1/auth")
@RestController
@RequiredArgsConstructor
@Slf4j
public class AuthController {

    private final AuthService authService;
    private final RefreshCookieMapper refreshCookieMapper;

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
    @PostMapping("/reissue")
    public CommonResponse<AuthResponse> refreshToken(@CookieValue String refreshToken,
                                          HttpServletResponse response) throws IOException {
        AuthResponse authResponse = null;
        Optional<AuthResponse> optionalTokenDto = authService.regenerateToken(refreshToken);
        if (optionalTokenDto.isPresent()){
            authResponse = optionalTokenDto.get();

            response.addHeader(AUTHORIZATION, BEARER + authResponse.getAccessToken());

            ResponseCookie refreshCookie = refreshCookieMapper.responseCookie(authResponse.getRefreshToken());
            response.addHeader("Set-Cookie", refreshCookie.toString());  // ← 추가해야 브라우저에 저장됨

            return CommonResponse.<AuthResponse>builder()
                    .message(SUCCESS_MESSAGE)
                    .status(200)
                    .data(authResponse)
                    .build();

        }
        return CommonResponse.<AuthResponse>builder()
                .message(FAIL_MESSAGE)
                .status(404)
                .data(authResponse)
                .build();
    }
    @GetMapping("/private")
    public int welcome(){
        return 200;
    }

}
