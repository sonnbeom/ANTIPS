package backend.patient.dto.response;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Builder
@Getter
@Setter
public class ResponsePatientListDto {
    private int listSize ;
    private List<ResponsePatientDto> patientList;
}
