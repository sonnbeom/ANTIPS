package backend.patient.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RequestPatientDto {

    private String name;
    private int roomNumber;
    private LocalDateTime admissionDate;
    private String specifics;
    private int floor;
    private String caseHistory;
    private float temperature;
    private int urgencyLevel;
}
