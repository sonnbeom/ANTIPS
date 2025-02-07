package backend.emergency.dto.response;

import backend.patient.dto.response.ResponsePatientDto;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class ResponseEmergencyDto {
    private Long id;
    private String title;
    private String content;
    private LocalDateTime createdAt;
    private ResponsePatientDto patientDto;
}
