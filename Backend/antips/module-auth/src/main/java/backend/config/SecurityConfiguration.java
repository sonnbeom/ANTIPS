package backend.config;

import backend.jwt.filter.JwtTokenFilter;

import backend.jwt.service.JwtService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

import static org.springframework.http.HttpMethod.POST;

@EnableWebSecurity
@Configuration
public class SecurityConfiguration {

    private final JwtService jwtService;

    public SecurityConfiguration(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        httpSecurity
                .sessionManagement((session) -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        httpSecurity
                .addFilterBefore(new JwtTokenFilter(jwtService), UsernamePasswordAuthenticationFilter.class);
        httpSecurity
                .csrf(csrf -> csrf.disable());
        httpSecurity
                .headers(headers -> headers.disable());
        httpSecurity
                .formLogin((auth -> auth.disable()));
        httpSecurity.authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/css/**", "/images/**", "/js/**", "/h2-console/**").permitAll()
                .requestMatchers("/api/v1/auth/login").permitAll()
                .requestMatchers("/swagger", "/swagger-ui.html", "/swagger-ui/**", "/api-docs", "/api-docs/**", "/v3/api-docs/**").permitAll()
                .anyRequest().authenticated());

        return httpSecurity.build();
    }
}
