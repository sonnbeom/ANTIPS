package backend.emergency.controller;

import backend.emergency.dto.request.RequestEmergencyDto;
import backend.emergency.dto.response.ResponseEmergencyDtoList;
import backend.emergency.service.EmergencyService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;

import java.util.concurrent.CopyOnWriteArrayList;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Sinks;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/v1/service")
public class EmergencyController {

    private final Sinks.Many<String> sink = Sinks.many().multicast().onBackpressureBuffer();
    private final EmergencyService emergencyService;
    private final ObjectMapper objectMapper;

    @GetMapping(value = "/public/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public Flux<String> streamData() {
//        log.info("현재 구독자 수: {}", sink.currentSubscriberCount());
//        return sink.asFlux();
        log.info("📡 [SSE 연결 시작] 현재 구독자 수: {}", sink.currentSubscriberCount());

        return sink.asFlux()
                .doOnSubscribe(subscription -> log.info("✅ [SSE 구독 완료] 구독자 수: {}", sink.currentSubscriberCount()))
                .doOnCancel(() -> log.info("❌ [SSE 연결 종료] 구독자 수: {}", sink.currentSubscriberCount()));


    }




    @PostMapping("/public/emergency")
    public void checkEmergency(@RequestBody RequestEmergencyDto requestEmergencyDto) {
        log.info("🚨 [비상 요청 수신] 요청 데이터: {}", requestEmergencyDto);

        int subscriberCount = sink.currentSubscriberCount();
        log.info("📡 현재 구독자 수: {}", subscriberCount);

        if (subscriberCount == 0) {
            log.warn("⚠️ [구독자 없음] 메시지를 전송하지 않습니다.");
        }
        ResponseEmergencyDtoList emergency = emergencyService.isEmergency(requestEmergencyDto);
        try {
            String jsonEmergency = objectMapper.writeValueAsString(emergency);
            sink.tryEmitNext(jsonEmergency);
            log.info("구독자 메시지 전달 성공");
        } catch (JsonProcessingException e) {
            log.info("구독자 메시지 전달 실패");
            throw new RuntimeException(e);
        }
        log.info("컨트롤러 호출 메시지 전송 완료");
    }
}

