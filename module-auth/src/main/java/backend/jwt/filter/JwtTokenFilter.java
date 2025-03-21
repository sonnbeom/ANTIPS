package backend.jwt.filter;


import backend.jwt.service.JwtService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.http.HttpHeaders;
import java.io.IOException;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
public class JwtTokenFilter extends OncePerRequestFilter {
    private final JwtService jwtService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        Optional<String> accessToken = getToken(request, HttpHeaders.AUTHORIZATION);
        log.info("filter 작동");
        log.info("accessToken", accessToken);
        if (!accessToken.isEmpty() && jwtService.isTokenValid(accessToken.get())){
            log.info("토큰 비어있지 않음");
            UsernamePasswordAuthenticationToken authentication = jwtService.validateToken(accessToken.get());
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.info("인증 완료");
        }
        filterChain.doFilter(request, response);

    }
    private Optional<String> getToken(HttpServletRequest request, String headerName){
        String authorizationHeader = request.getHeader(headerName);
        log.info("authorizationHeader",  authorizationHeader);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")){
            return Optional.ofNullable(authorizationHeader.split(" ")[1]);
        }else {
            return Optional.empty();
        }
    }
}
