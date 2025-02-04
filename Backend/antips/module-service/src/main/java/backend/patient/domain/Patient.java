package backend.patient.domain;


import backend.patient.dto.ResponsePatientDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "patient")
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Patient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "patient_id", nullable = false)
    private Long id;
    private String name;
    @Column(name = "room_number", nullable = false)
    private int roomNumber;
    @Column(name = "admission_date", nullable = false)
    private LocalDateTime admissionDate;
    @Column(name = "specifics", nullable = false)
    private String specifics;
    private int floor;
    @Column(name = "case_history", nullable = false)
    private String caseHistory;
    private float temperature;
    @Column(name = "urgency_level", nullable = false)
    private int urgencyLevel;

    public ResponsePatientDto entityToDto(Patient savedPatient) {
        return ResponsePatientDto.builder()
                .id(id)
                .caseHistory(caseHistory)
                .admissionDate(admissionDate)
                .floor(floor)
                .roomNumber(roomNumber)
                .urgencyLevel(urgencyLevel)
                .specifics(specifics)
                .temperature(temperature)
                .name(name)
                .build();
    }
}
