package backend.jwt.service;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import backend.exception.AuthUserNotFoundException;
import backend.jwt.dto.CustomUserDetails;
import backend.domain.User;
import backend.repository.UserRepository;

@Service
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    public CustomUserDetailService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public CustomUserDetails loadUserByUsername(String employeeNumber) throws UsernameNotFoundException {
        User member = userRepository.findByEmployeeNumber(employeeNumber)
                .orElseThrow(() -> new AuthUserNotFoundException("해당 사번에 해당하는 인원을 찾을 수 없습니다: %s "+ employeeNumber, HttpStatus.NOT_FOUND));
        return new CustomUserDetails(member);

    }
}
