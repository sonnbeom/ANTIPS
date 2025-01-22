//package backend.antips.config;
//
//import backend.antips.authorization.jwt.service.JwtService;
//import jakarta.servlet.http.HttpServletRequest;
//import org.springframework.context.annotation.Bean;
//import org.springframework.context.annotation.Configuration;
//import org.springframework.security.config.annotation.web.builders.HttpSecurity;
//import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
//import org.springframework.security.config.http.SessionCreationPolicy;
//import org.springframework.security.web.SecurityFilterChain;
//import org.springframework.web.cors.CorsConfiguration;
//import org.springframework.web.cors.CorsConfigurationSource;
//import java.util.Collections;
//import static org.springframework.http.HttpMethod.*;
//
//@EnableWebSecurity
//@Configuration
//public class SecurityConfiguration {
//
//    private final JwtService jwtService;
//
//    public SecurityConfiguration(JwtService jwtService) {
//        this.jwtService = jwtService;
//    }
//
//    @Bean
//    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
//        httpSecurity
//                .cors((cors) -> cors
//                        .configurationSource(new CorsConfigurationSource() {
//                            @Override
//                            public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
//                                CorsConfiguration configuration = new CorsConfiguration();
//                                // 허용할 도메인
//                                configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
//                                // 허용할 메소드
//                                configuration.setAllowedMethods(Collections.singletonList("*"));
//                                // 쿠키나 인증 정보를 포함한 요청을 허용할지 여부 설정
//                                configuration.setAllowCredentials(true);
//                                // 모든 헤더 허용
//                                configuration.setAllowedHeaders(Collections.singletonList("*"));
//                                configuration.setExposedHeaders(Collections.singletonList("Authorization"));
//                                return configuration;
//
//                            }
//                        }));
//        httpSecurity
//                .sessionManagement((session) -> session
//                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
////        httpSecurity
////                .addFilterBefore(new JwtTokenFilter(jwtService), UsernamePasswordAuthenticationFilter.class);
//        httpSecurity
//                .csrf(csrf -> csrf.disable());
//        httpSecurity
//                .headers(headers -> headers.disable());
//        httpSecurity
//                .formLogin((auth -> auth.disable()));
//        httpSecurity.authorizeHttpRequests(auth -> auth
//                .requestMatchers("/", "/css/**", "/images/**", "/js/**", "/h2-console/**").permitAll()
//                .requestMatchers(POST, "/api/v1/login").permitAll()
//                .requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**").permitAll()
//                .anyRequest().authenticated());
//
//        return httpSecurity.build();
//    }
//}
