package backend.redis.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.concurrent.TimeUnit;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class RedisService {
    @Value("${spring.redis.timeout}")
    private long timeOut;

    private final RedisTemplate<String, String> redisTemplate;

    public void setValues(String key, String value){
        redisTemplate.opsForValue().set(key, value);
    }

    public void setValuesWithTimeOut(String key, String value){
        redisTemplate.opsForValue().set(key, value, timeOut, TimeUnit.MILLISECONDS);
    }

    public String getValues(String key){
        return redisTemplate.opsForValue().get(key);
    }

    public void deleteValues(String key){
        redisTemplate.delete(key);
    }
}