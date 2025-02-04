package backend.service;

import backend.dto.requesst.LoginRequestDto;
import backend.dto.response.AuthResponse;
import backend.exception.UserNotFoundException;
import backend.jwt.service.JwtService;
import backend.domain.User;

import backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;

    private final JwtService jwtService;

    public AuthResponse login(LoginRequestDto loginRequestDto) {
        User user = userRepository.findByEmployeeNumber(loginRequestDto.getEmployeeNumber())
                .orElseThrow(() -> new UserNotFoundException(loginRequestDto.getEmployeeNumber() + "을 사번으로 가진 직원이 존재하지 않습니다", HttpStatus.NOT_FOUND));
        return jwtService.provideToken(loginRequestDto.getEmployeeNumber(), null);
    }
}
