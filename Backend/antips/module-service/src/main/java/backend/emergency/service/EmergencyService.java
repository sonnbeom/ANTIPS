package backend.emergency.service;

import backend.emergency.domain.Emergency;
import backend.emergency.dto.request.RequestEmergencyDto;
import backend.emergency.dto.response.ResponseEmergencyDtoList;
import backend.emergency.mapper.EmergencyMapper;
import backend.emergency.repository.CustomEmergencyRepository;
import backend.emergency.repository.EmergencyRepository;
import backend.fcm.service.FcmTokenService;
import backend.patient.domain.Patient;
import backend.patient.service.PatientService;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static backend.emergency.constant.EmergencyConstant.*;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmergencyService {

    private final FcmTokenService fcmTokenService;
    private final EmergencyRepository emergencyRepository;
    private final EmergencyMapper emergencyMapper;
    private final CustomEmergencyRepository customEmergencyRepository;
    private final HttpSenderService httpSenderService;
    private final PatientService patientService;

    public void isEmergency(RequestEmergencyDto requestEmergencyDto) {
        if (isNotValidTemperature(requestEmergencyDto.getTemperature())) {
            alertByTemperature(requestEmergencyDto);
            ResponseEmergencyDtoList emergencyList = getEmergencyList();
            httpSenderService.sendEmergencyList(emergencyList);

        } else if (isNotValidSapWeight(requestEmergencyDto.getSapWeight())) {
            System.out.println("여기 수정해야함~");
        }
    }
    private ResponseEmergencyDtoList getEmergencyList(){
        List<Emergency> emergencyList = customEmergencyRepository.findActiveEmergency();
        return emergencyMapper.dtoToEntity(emergencyList);
    }

    private void alertByTemperature(RequestEmergencyDto requestEmergencyDto) {
        float temperature = requestEmergencyDto.getTemperature();

        if (temperature <= 36.5) {
            createMessage(requestEmergencyDto, TEMPERATURE_TITLE, LOW_TEMPERATURE_BODY);
            saveEmergency(requestEmergencyDto, TEMPERATURE_TITLE, LOW_TEMPERATURE_BODY+temperature);
        }
        else if (temperature >= 37.5) {
            createMessage(requestEmergencyDto, TEMPERATURE_TITLE, HIGH_TEMPERATURE_BODY);
            saveEmergency(requestEmergencyDto, TEMPERATURE_TITLE, HIGH_TEMPERATURE_BODY+temperature);
        }
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
    private void saveEmergency(RequestEmergencyDto requestEmergencyDto, String title, String message){
        Patient patient = patientService.findPatientByBedNumber(requestEmergencyDto.getBedNumber());
        Emergency emergency = emergencyMapper.dtoToEntity(title, message, patient);
        emergencyRepository.save(emergency);
    }
    private void createMessage(RequestEmergencyDto requestEmergencyDto, String title ,String bodyContent){
        String responseFcmToken = fcmTokenService.getFcmToken(requestEmergencyDto.getToken());
        Optional<Message> message = Optional.of(createTemperatureMessage(responseFcmToken, requestEmergencyDto.getBedNumber(), bodyContent, requestEmergencyDto.getTemperature()));
        message.ifPresent(this::sendMessage);
    }

    private boolean isNotValidTemperature(float temperature) {
        return temperature != -1.0;
    }

    private boolean isNotValidSapWeight(float sapWeight) {
        return sapWeight == 1.0;
    }

}
