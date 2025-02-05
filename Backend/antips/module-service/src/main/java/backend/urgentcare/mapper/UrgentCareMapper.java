package backend.urgentcare.mapper;

import backend.patient.domain.Patient;
import backend.urgentcare.domain.UrgentCare;
import backend.urgentcare.dto.request.RequestUrgentCareDto;
import org.springframework.stereotype.Service;

@Service
public class UrgentCareMapper {
    public UrgentCare dtoToEntity(RequestUrgentCareDto requestUrgentCareDto, Patient patient) {
        return UrgentCare.builder()
                .content(requestUrgentCareDto.getContent())
                .patient(patient)
                .build();

    }
}
