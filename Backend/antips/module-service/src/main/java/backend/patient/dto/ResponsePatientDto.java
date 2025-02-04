package backend.patient.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

@Builder
@AllArgsConstructor
@Getter
public class ResponsePatientDto {
    private Long id;
    private String name;
    private int roomNumber;
    private LocalDateTime admissionDate;
    private String specifics;
    private int floor;
    private String caseHistory;
    private float temperature;
    private int urgencyLevel;
}
