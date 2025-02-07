package backend.emergency.service;

import backend.emergency.dto.request.RequestEmergencyDto;
import backend.emergency.repository.FcmTokenRepository;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

import static backend.emergency.constant.EmergencyConstant.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final FcmTokenRepository fcmTokenRepository;

    public void isEmergency(RequestEmergencyDto requestEmergencyDto) {
        log.info(String.valueOf(requestEmergencyDto.getTemperature()));
        log.info(String.valueOf(isNotValidTemperature(requestEmergencyDto.getTemperature())));
        if (isNotValidTemperature(requestEmergencyDto.getTemperature())) {
            log.info("유효하지 않은 온도");
            processTemperatureAlert(requestEmergencyDto);
        } else if (isNotValidSapWeight(requestEmergencyDto.getSapWeight())) {
            System.out.println("여기 수정해야함~");
        }
    }

    // ✅ 온도 경고 프로세스 분리
    private void processTemperatureAlert(RequestEmergencyDto requestEmergencyDto) {
        float temperature = requestEmergencyDto.getTemperature();

        if (temperature <= 36.5 || temperature >= 37.5) {
            log.info("온도 조거문 들어오냐");
            String fcmToken = getFcmToken(requestEmergencyDto.getToken());  // ✅ FCM 토큰 조회
            checkTemperature(requestEmergencyDto, fcmToken).ifPresent(this::sendMessage);
        }
    }

    // ✅ 온도 조건에 따라 알림 메시지 생성
    private Optional<Message> checkTemperature(RequestEmergencyDto requestEmergencyDto, String fcmToken) {
        float temperature = requestEmergencyDto.getTemperature();

        if (temperature <= 36.5) {
            return Optional.of(createTemperatureMessage(fcmToken, requestEmergencyDto.getBedNumber(), LOW_TEMPERATURE_BODY, temperature));
        } else if (temperature >= 37.5) {
            return Optional.of(createTemperatureMessage(fcmToken, requestEmergencyDto.getBedNumber(), HIGH_TEMPERATURE_BODY, temperature));
        }
        return Optional.empty();
    }


    private String getFcmToken(String fcmToken) {
        fcmTokenRepository.findByToken(fcmToken)
                .orElseThrow(() -> new RuntimeException("FCM 토큰을 찾을 수 없음"));

        return fcmToken;
    }

    private Message createTemperatureMessage(String token, String bedNumber, String fcmContent, float temperature) {
        return Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(TEMPERATURE_TITLE + bedNumber)
                        .setBody(fcmContent + temperature)
                        .build())
                .build();
    }

    private void sendMessage(Message message) {
        try {
            FirebaseMessaging.getInstance().send(message);
            log.info("웹 푸쉬 알림 메시지 전달 성공");
        } catch (FirebaseMessagingException e) {
            log.info("웹 푸쉬 알림 메시지 전달 실패");
            throw new RuntimeException(e);
        }
    }

    private boolean isNotValidTemperature(float temperature) {
        return temperature != -1.0;
    }

    private boolean isNotValidSapWeight(float sapWeight) {
        return sapWeight == 1.0;
    }

}
