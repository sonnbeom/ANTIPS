package backend.emergency.mapper;

import backend.emergency.domain.Fcm;
import backend.emergency.dto.request.RequestFcmDto;
import org.springframework.stereotype.Service;

@Service
public class FcmMapper {

    public Fcm dtoToEntity(RequestFcmDto requestFcmDto) {
        return Fcm.builder()
                .token(requestFcmDto.getToken())
                .build();
    }
}
