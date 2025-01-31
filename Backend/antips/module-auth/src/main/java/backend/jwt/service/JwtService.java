package backend.jwt.service;

import backend.dto.response.AuthResponse;
import backend.exception.InvalidJwtException;
import backend.jwt.dto.CustomUserDetails;
import backend.user.domain.User;
import io.jsonwebtoken.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.stereotype.Service;

import javax.management.relation.Role;
import java.util.Date;

@Slf4j
@Service
@RequiredArgsConstructor
public class JwtService {

    @Value("${secretKey}")
    private String key;

    private final CustomUserDetailService customUserDetailService;
//    private long expireTimeMs = 100000;
//    private long refreshExpireTimeMs = 100000;
    private long expireTimeMs = 86_400_000; // 24시간 (1일)
    private long refreshExpireTimeMs = 86_400_000; // 24시간 (1일)

    public AuthResponse provideToken(String employeeNumber, User.Role role){
        String accessToken = createToken(employeeNumber, role);
        String refreshToken = createRefreshToken(employeeNumber);
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .build();
    }
    private String createRefreshToken(String employeeNumber){
        Claims claims = Jwts.claims();
        claims.put("EMPLOYEE_NUMBER", employeeNumber);
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpireTimeMs))
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();

    }
    public String createToken(String employeeNumber, User.Role role){
        Claims claims = Jwts.claims();
        claims.put("EMPLOYEE_NUMBER", employeeNumber);
        claims.put("ROLE_TYPE", role.name());
        return Jwts.builder()
                .setClaims(claims)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireTimeMs))
                .signWith(SignatureAlgorithm.HS256, key)
                .compact();
    }
    public boolean isTokenValid(String token){
        try {
            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
            return true;
        } catch (SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
        }
        return false;
    }

    public UsernamePasswordAuthenticationToken validateToken(String token) {
        Claims claims = extractClaims(token);
        String employeeNumber = claims.get("EMPLOYEE_NUMBER").toString();
        CustomUserDetails userDetails = customUserDetailService.loadUserByUsername(employeeNumber);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

        return authentication;
    }
    public String extractEmail(String token){
        return extractClaims(token).get("EMAIL").toString();
    }
    private Claims extractClaims(String token) {
        try {
            return Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody();
        } catch (SecurityException | MalformedJwtException e) {
            log.info("잘못된 JWT 서명입니다.");
            throw new InvalidJwtException("잘못된 JWT 서명입니다.", e, HttpStatus.UNAUTHORIZED);
        } catch (ExpiredJwtException e) {
            log.info("만료된 JWT 토큰입니다.");
            throw new InvalidJwtException("만료된 JWT 토큰입니다.", e, HttpStatus.UNAUTHORIZED);
        } catch (UnsupportedJwtException e) {
            log.info("지원되지 않는 JWT 토큰입니다.");
            throw new InvalidJwtException("지원되지 않는 JWT 토큰입니다.", e, HttpStatus.BAD_REQUEST);
        } catch (IllegalArgumentException e) {
            log.info("JWT 토큰이 잘못되었습니다.");
            throw new InvalidJwtException("JWT 토큰이 잘못되었습니다." ,e, HttpStatus.BAD_REQUEST);
        }
    }
}
