package backend.patient.dto.response;

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
    private int age;
    private int roomNumber;
    private String specifics;
    private int floor;
    private String caseHistory;
    private float temperature;
    private int urgencyLevel;
    private String status;
    private String bedNumber;
    private LocalDateTime createdAt;
}
