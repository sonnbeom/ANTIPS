package backend.emergency.service;

import backend.emergency.domain.Emergency;
import backend.emergency.dto.request.RequestEmergencyDto;
import backend.emergency.dto.response.ResponseEmergencyDtoList;
import backend.emergency.exception.EmergencyNotFoundException;
import backend.emergency.mapper.EmergencyMapper;
import backend.emergency.repository.CustomEmergencyRepository;
import backend.emergency.repository.EmergencyRepository;
import backend.fcm.domain.Fcm;
import backend.fcm.service.FcmTokenService;
import backend.patient.domain.Patient;
import backend.patient.service.PatientService;
import com.google.firebase.messaging.FirebaseMessaging;
import com.google.firebase.messaging.FirebaseMessagingException;
import com.google.firebase.messaging.Message;
import com.google.firebase.messaging.Notification;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
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

    public ResponseEmergencyDtoList isEmergency(RequestEmergencyDto requestEmergencyDto) {
        if (isNotValidTemperature(requestEmergencyDto.getTemperature())) {
            alertByTemperature(requestEmergencyDto);
            return getEmergencyList();

        } else if (isNotValidSapWeight(requestEmergencyDto.getSapWeight())) {
            alertBySapWeight(requestEmergencyDto);
            return getEmergencyList();
        }
        return null;
    }
    private void alertBySapWeight(RequestEmergencyDto requestEmergencyDto){
        createMessageBysapWeight(requestEmergencyDto);
        saveEmergency(requestEmergencyDto, SAP_WEIGHT_TITLE, SAP_WEIGHT_BODY);
    }

    public ResponseEmergencyDtoList getEmergencyList(){
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

    private Message createTemperatureMessage(String token, String bedNumber, String content, float temperature) {
        return Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(TEMPERATURE_TITLE + bedNumber)
                        .setBody(content + temperature)
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
        List<String> fcmTokens = fcmTokenService.getFcmTokens();
        for(String fcm: fcmTokens){
            Optional<Message> message = Optional.of(createTemperatureMessage(fcm, requestEmergencyDto.getBedNumber(), bodyContent, requestEmergencyDto.getTemperature()));
            message.ifPresent(this::sendMessage);
        }
    }
    private void createMessageBysapWeight(RequestEmergencyDto requestEmergencyDto) {
        List<String> fcmTokens = fcmTokenService.getFcmTokens();
        for(String fcm: fcmTokens){
            Optional<Message> message = Optional.of(createSapWeightMessage(fcm, requestEmergencyDto.getBedNumber(),SAP_WEIGHT_BODY));
            message.ifPresent(this::sendMessage);
        }
    }
    private Message createSapWeightMessage(String token, String bedNumber, String content) {
        return Message.builder()
                .setToken(token)
                .setNotification(Notification.builder()
                        .setTitle(SAP_WEIGHT_TITLE + bedNumber)
                        .setBody(content)
                        .build())
                .build();
    }

    private boolean isNotValidTemperature(float temperature) {
        return temperature != -1.0;
    }

    private boolean isNotValidSapWeight(float sapWeight) {
        return sapWeight == 2;
    }

    public void deactivateEmergency(Long emergencyId) {
        Emergency emergency = emergencyRepository.findById(emergencyId)
                .orElseThrow(() -> new EmergencyNotFoundException(emergencyId + "로 해당하는 비상상황을 조회할 수 없습니다.", HttpStatus.NOT_FOUND));
        emergency.deactivate(emergency);
    }
}
