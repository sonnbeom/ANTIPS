package backend.patient.dto.request;


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
    private int age;
    private LocalDateTime admissionDate;
    private String specifics;
    private int floor;
    private String caseHistory;
    private float temperature;
    private int urgencyLevel;
    private String qrCode;
    private String bedNumber;
}
