package backend.filter;

import backend.exception.CustomMonoClientException;
import backend.exception.CustomMonoServerException;
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
        if (path.startsWith(AUTH_REQUIRED_PATH)){
            log.info("if문 들어오냐 설마");
            String token = exchange.getRequest().getHeaders().getFirst(AUTHORIZATION);
            return webClientBuilder.build()
                    .get() // 인증 서버에 get 요청을 보낸다.
                    .uri(AUTH_SERVER_URI)
                    .header(AUTHORIZATION, token) // 헤더에 토큰 포함
                    .retrieve()
                    .onStatus(
                            status -> status.is4xxClientError(),
                            clientResponse -> Mono.error(new CustomMonoClientException("클라이언트 요청 에러 발생", BAD_REQUEST))
                    )
                    .onStatus(
                            status -> status.is5xxServerError(),
                            clientResponse -> Mono.error(new CustomMonoServerException("클라이언트 요청 에러 발생", INTERNAL_SERVER_ERROR))
                    )
                    .bodyToMono(String.class)//인증 서버의 응답은 비동기로 Mono<String> 형태로 반환 토큰은 String 이므로
                    // bodyToMono => 응답본문을 지정한 타입으로 변환
                    .flatMap(response -> {
                        if (response.equals("VALID")){
                            return chain.filter(exchange);
                        }
                        exchange.getResponse().setStatusCode(UNAUTHORIZED);
                        return exchange.getResponse().setComplete();
                    });
        }
        return chain.filter(exchange);
    }
}
