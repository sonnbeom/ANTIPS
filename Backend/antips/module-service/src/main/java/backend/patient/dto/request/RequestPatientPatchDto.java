package backend.patient.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@NoArgsConstructor
@Getter
@Setter
public class RequestPatientPatchDto {
    private Long id;
    private Integer roomNumber;
    private String specifics;
    private Integer floor;
    private String caseHistory;
    private Float temperature;
    private Integer urgencyLevel;
    private String status;
}
