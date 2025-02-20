package backend.redis.config;

import backend.redis.properties.RedisProperties;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisConnectionFactory;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.repository.configuration.EnableRedisRepositories;
import org.springframework.data.redis.serializer.StringRedisSerializer;

@RequiredArgsConstructor
@Configuration
@EnableRedisRepositories
public class RedisConfig {

    private final RedisProperties redisProperties;

    @Bean
    public RedisConnectionFactory redisConnectionFactory(){
        return new LettuceConnectionFactory(redisProperties.getHost(), redisProperties.getPort());
    }
    @Bean
    public RedisTemplate<String, Object> redisTemplate(){
        RedisTemplate<String, Object> redisTemplate = new RedisTemplate<>();
        redisTemplate.setConnectionFactory(redisConnectionFactory());
        /*
         RedisTemplate에 RedisConnectionFactory를 설정합니다. 이 연결 팩토리는 Redis 서버에 대한 연결을 관리합니다.
         redisConnectionFactory() 이 메소드는 Redis 서버에 연결하기 위한 설정 정보(호스트, 포트, 비밀번호 등)를 포함하는
         RedisConnectionFactory의 구현체를 반환합니다.
         */
        redisTemplate.setKeySerializer(new StringRedisSerializer());
        /*
        Redis의 키를 직렬화하는 방법으로 StringRedisSerializer를 사용하도록 설정합니다. 이는 Redis의 키가 문자열 형태로 저장되어야 함을 의미합니다.
        StringRedisSerializer는 문자열 데이터를 바이트 배열로 변환하는 역할을 합니다.
        */
        redisTemplate.setValueSerializer(new StringRedisSerializer());
        // Redis의 값(value)에 대한 직렬화 방식도 StringRedisSerializer로 설정합니다.
        return redisTemplate;
    }
}