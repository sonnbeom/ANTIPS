package backend.fcm.service;


import backend.fcm.domain.Fcm;
import backend.fcm.dto.request.RequestFcmDto;
import backend.fcm.dto.response.ResponseFcmDto;
import backend.fcm.mapper.FcmMapper;
import backend.fcm.repository.FcmTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;
import org.springframework.stereotype.Service;

@Service
@Log4j2
@RequiredArgsConstructor
public class FcmTokenService {

    private final FcmTokenRepository fcmTokenRepository;
    private final FcmMapper fcmMapper;

    public String getFcmToken(String fcmToken) {
        fcmTokenRepository.findByToken(fcmToken)
                .orElseThrow(() -> new RuntimeException("FCM 토큰을 찾을 수 없음"));
        return fcmToken;
    }
    public ResponseFcmDto saveFcmToken(RequestFcmDto requestFcmDto) {
        Fcm fcm = fcmMapper.dtoToEntity(requestFcmDto);
        fcmTokenRepository.save(fcm);
        return fcm.entityToDto(fcm);
    }
}
