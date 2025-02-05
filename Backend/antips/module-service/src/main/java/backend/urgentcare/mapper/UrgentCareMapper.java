package backend.urgentcare.mapper;

import backend.patient.domain.Patient;
import backend.urgentcare.domain.UrgentCare;
import backend.urgentcare.dto.request.RequestUrgentCareDto;
import backend.urgentcare.dto.response.ResponseUrgentCareDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UrgentCareMapper {
    public UrgentCare dtoToEntity(RequestUrgentCareDto requestUrgentCareDto, Patient patient) {
        return UrgentCare.builder()
                .content(requestUrgentCareDto.getContent())
                .patient(patient)
                .build();

    }

    public List<ResponseUrgentCareDto> entityToDto(List<UrgentCare> urgentCareList) {
        List<ResponseUrgentCareDto> responseUrgentCareDtoList = new ArrayList<>();
        for (UrgentCare urgentCare: urgentCareList){
            responseUrgentCareDtoList.add(urgentCare.entityToDto(urgentCare));
        }
        return responseUrgentCareDtoList;
    }
}
