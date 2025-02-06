package backend.filter;

import backend.exception.CustomMonoClientException;
import backend.exception.CustomMonoServerException;
import backend.response.AuthResponse;
import lombok.extern.log4j.Log4j2;
import org.springframework.cloud.gateway.filter.GatewayFilterChain;
import lombok.RequiredArgsConstructor;
import org.springframework.core.annotation.Order;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.server.ServerWebExchange;
import reactor.core.publisher.Mono;

import static backend.constant.HeaderConstant.*;
import static backend.constant.UriConstant.*;
import static org.springframework.http.HttpStatus.*;

@Component
@Order(0)
@RequiredArgsConstructor
@Log4j2
public class GlobalFilter implements org.springframework.cloud.gateway.filter.GlobalFilter {
    private final WebClient.Builder webClientBuilder;

    @Override
    public Mono<Void> filter(ServerWebExchange exchange, GatewayFilterChain chain) {
        log.info("gateway filter 작동");
        String path = exchange.getRequest().getPath().toString();
        if (AUTH_REQUIRED_PATHS.stream().anyMatch(path::startsWith)){
            log.info("if문 들어오냐 설마");
            String authHeader  = exchange.getRequest().getHeaders().getFirst(AUTHORIZATION);
            // Authorization 헤더가 존재하고 "Bearer "로 시작하는지 확인
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                exchange.getResponse().setStatusCode(UNAUTHORIZED);
                return exchange.getResponse().setComplete();
            }

            // "Bearer " 이후의 JWT 토큰만 추출
            String token = authHeader.substring(7);
            log.info(token);
            return webClientBuilder.build()
                    .get() // 인증 서버에 get 요청을 보낸다.
                    .uri(AUTH_DOCKER_SERVER_URI)
                    .header(AUTHORIZATION, "Bearer "+token) // 헤더에 토큰 포함
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError(),
                            clientResponse -> Mono.error(new CustomMonoClientException("클라이언트 요청 에러 발생", BAD_REQUEST))
                    )
                    .onStatus(
                            status -> status.is5xxServerError(),
                            clientResponse -> Mono.error(new CustomMonoServerException("클라이언트 요청 에러 발생", INTERNAL_SERVER_ERROR))
                    )
                    .bodyToMono(AuthResponse.class)//인증 서버의 응답은 비동기로 Mono<String> 형태로 반환 토큰은 String 이므로
                    // bodyToMono => 응답본문을 지정한 타입으로 변환
                    .flatMap(authResponse -> {
                        log.info("response", authResponse);
                        if (authResponse.getMessage().equals("SUCCESS")){
                            ServerWebExchange mutatedExchange = exchange.mutate()
                                    .request(r -> r.headers(headers -> headers.add("X-User-Id", authResponse.getUserId())))
                                    .build();
                            log.info("요청통과");
                            return chain.filter(exchange);
                        }
                        log.info("filter 작동했지만 시큐리티 인증은 실패");
                        exchange.getResponse().setStatusCode(UNAUTHORIZED);

                        return exchange.getResponse().setComplete();
                    });
        }
        return chain.filter(exchange);
    }
}
