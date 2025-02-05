package backend.urgentcare.dto.response;

import backend.patient.dto.response.ResponsePatientDto;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
@AllArgsConstructor
public class ResponseUrgentCareWithPatientDto {
    private ResponsePatientDto patient;
    private List<ResponseUrgentCareDto> urgentCareList;
}
