//package backend.antips.authorization.jwt.filter;
//
//import backend.antips.authorization.jwt.service.JwtService;
//import jakarta.servlet.FilterChain;
//import jakarta.servlet.ServletException;
//import jakarta.servlet.http.HttpServletRequest;
//import jakarta.servlet.http.HttpServletResponse;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.web.filter.OncePerRequestFilter;
//import java.io.IOException;
//
//@Slf4j
//public class JwtTokenFilter extends OncePerRequestFilter {
//
//    private final JwtService jwtService;
//
//    public JwtTokenFilter(JwtService jwtService) {
//        this.jwtService = jwtService;
//    }
//
//    @Override
//    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//
//    }
//}
