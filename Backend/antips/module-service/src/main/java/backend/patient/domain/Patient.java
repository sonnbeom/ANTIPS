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
    private String status;

    public ResponsePatientDto entityToDto(Patient patient) {
        return ResponsePatientDto.builder()
                .id(patient.id)
                .caseHistory(patient.caseHistory)
                .admissionDate(patient.admissionDate)
                .floor(patient.floor)
                .roomNumber(patient.roomNumber)
                .urgencyLevel(patient.urgencyLevel)
                .specifics(patient.specifics)
                .temperature(patient.temperature)
                .name(patient.name)
                .status(patient.status)
                .build();
    }
}
