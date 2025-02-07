package backend.fcm.mapper;

import backend.fcm.domain.Fcm;
import backend.fcm.dto.request.RequestFcmDto;
import org.springframework.stereotype.Service;

@Service
public class FcmMapper {

    public Fcm dtoToEntity(RequestFcmDto requestFcmDto) {
        return Fcm.builder()
                .token(requestFcmDto.getToken())
                .build();
    }
}
