package backend.service;

import backend.dto.requesst.LoginRequestDto;
import backend.dto.response.AuthResponse;
import backend.exception.RefreshTokenReissueException;
import backend.exception.UserNotFoundException;
import backend.jwt.service.JwtService;
import backend.domain.User;

import backend.redis.service.RedisService;
import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    private final RedisService redisService;

    public AuthResponse login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByEmployeeNumber(loginRequestDto.getEmployeeNumber())
                .orElseThrow(() -> new UserNotFoundException(loginRequestDto.getEmployeeNumber() + "을 사번으로 가진 직원이 존재하지 않습니다", HttpStatus.NOT_FOUND));
        return jwtService.provideToken(loginRequestDto.getEmployeeNumber(), null);
    }

    public Optional<AuthResponse> regenerateToken(String refreshToken) {
        AuthResponse authResponse = null;
        // cookie에서 가져온 refreshToken 체크
        if (ObjectUtils.isEmpty(refreshToken)){
            throw new RefreshTokenReissueException("Refresh Token is empty", HttpStatus.BAD_REQUEST);
        }

        String employeeNumber = jwtService.extractEmployeeNumber(refreshToken);
        User user = userRepository.findByEmployeeNumber(employeeNumber)
                .orElseThrow(() -> new UserNotFoundException(employeeNumber + "을 사번으로 가진 직원이 존재하지 않습니다", HttpStatus.NOT_FOUND));

        String savedRefreshToken = redisService.getValues(employeeNumber);

        if (!savedRefreshToken.equals(refreshToken)){
            throw new RefreshTokenReissueException("Redis에 있는 refreshToken과 클라이언트가 요구하는 refreshToken이 매칭되지 않습니다. ", HttpStatus.BAD_REQUEST);
        }

        redisService.deleteValues(employeeNumber);

        AuthResponse responseAuthResponse = jwtService.provideToken(employeeNumber, null);
        saveRefreshToken(employeeNumber, authResponse);

        return Optional.of(responseAuthResponse);
    }
    private void saveRefreshToken(String email, AuthResponse authResponse){
        redisService.setValuesWithTimeOut(
                email,
                authResponse.getRefreshToken());
    }
}
