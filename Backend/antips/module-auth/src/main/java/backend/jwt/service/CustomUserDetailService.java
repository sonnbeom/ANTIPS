package backend.jwt.service;


import backend.exception.AuthUserNotFoundException;
import backend.jwt.dto.CustomUserDetails;
import backend.user.domain.User;
import backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;


import org.springframework.http.HttpStatus;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public CustomUserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User member = userRepository.findByEmployeeNumber(email)
                .orElseThrow(() -> new AuthUserNotFoundException("해당 사번에 해당하는 인원을 찾을 수 없습니다: %s "+ email, HttpStatus.NOT_FOUND));
        return new CustomUserDetails(member);

    }
}
