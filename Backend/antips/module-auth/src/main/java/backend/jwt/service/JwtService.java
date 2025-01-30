//package backend.jwt.service;
//
//import backend.exception.InvalidJwtException;
//import backend.jwt.dto.CustomUserDetails;
//import io.jsonwebtoken.*;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.http.HttpStatus;
//import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
//import org.springframework.beans.factory.annotation.Value;
//import org.springframework.stereotype.Component;
//import org.springframework.stereotype.Service;
//
//import javax.management.relation.Role;
//import java.util.Date;
//
//@Slf4j
//@Service
//@RequiredArgsConstructor
//public class JwtService {
//
//    @Value("${secretKey}")
//    private String key;
//
//    private final CustomUserDetailService customUserDetailService;
//
//    public String createToken(String email, Role role, long expireTimeMs){
//        Claims claims = Jwts.claims();
//        claims.put("EMAIL", email);
//        claims.put("ROLE_TYPE", role);
//        return Jwts.builder()
//                .setClaims(claims)
//                .setIssuedAt(new Date(System.currentTimeMillis()))
//                .setExpiration(new Date(System.currentTimeMillis() + expireTimeMs))
//                .signWith(SignatureAlgorithm.HS256, key)
//                .compact();
//    }
//    public boolean isTokenValid(String token){
//        try {
//            Jwts.parser().setSigningKey(key).parseClaimsJws(token);
//            return true;
//        } catch (SecurityException | MalformedJwtException e) {
//            log.info("잘못된 JWT 서명입니다.");
//        } catch (ExpiredJwtException e) {
//            log.info("만료된 JWT 토큰입니다.");
//        } catch (UnsupportedJwtException e) {
//            log.info("지원되지 않는 JWT 토큰입니다.");
//        } catch (IllegalArgumentException e) {
//            log.info("JWT 토큰이 잘못되었습니다.");
//        }
//        return false;
//    }
//
//    public UsernamePasswordAuthenticationToken validateToken(String token) {
//        Claims claims = extractClaims(token);
//        String email = claims.get("EMAIL").toString();
//        CustomUserDetails userDetails = customUserDetailService.loadUserByUsername(email);
//        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
//
//        return authentication;
//    }
//    public String extractEmail(String token){
//        return extractClaims(token).get("EMAIL").toString();
//    }
//    private Claims extractClaims(String token) {
//        try {
//            return Jwts.parser().setSigningKey(key).parseClaimsJws(token).getBody();
//        } catch (SecurityException | MalformedJwtException e) {
//            log.info("잘못된 JWT 서명입니다.");
//            throw new InvalidJwtException("잘못된 JWT 서명입니다.", e, HttpStatus.UNAUTHORIZED);
//        } catch (ExpiredJwtException e) {
//            log.info("만료된 JWT 토큰입니다.");
//            throw new InvalidJwtException("만료된 JWT 토큰입니다.", e, HttpStatus.UNAUTHORIZED);
//        } catch (UnsupportedJwtException e) {
//            log.info("지원되지 않는 JWT 토큰입니다.");
//            throw new InvalidJwtException("지원되지 않는 JWT 토큰입니다.", e, HttpStatus.BAD_REQUEST);
//        } catch (IllegalArgumentException e) {
//            log.info("JWT 토큰이 잘못되었습니다.");
//            throw new InvalidJwtException("JWT 토큰이 잘못되었습니다." ,e, HttpStatus.BAD_REQUEST);
//        }
//    }
//}
