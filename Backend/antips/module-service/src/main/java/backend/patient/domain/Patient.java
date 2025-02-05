package backend.patient.domain;


import backend.common.domain.BaseEntity;
import backend.patient.dto.response.ResponsePatientDto;
import backend.urgentcare.domain.UrgentCare;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "patient")
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Patient extends BaseEntity {
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
    @OneToMany(mappedBy = "patient",
            cascade = CascadeType.ALL,
            orphanRemoval = true,
            fetch = FetchType.LAZY)
    private List<UrgentCare> urgentCares = new ArrayList<>();

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

    public void updateCaseHistory(String caseHistory) {
        this.caseHistory = caseHistory;
    }

    public void updateStatus(String status) {
        this.status = status;
    }

    public void updateFloor(Integer floor) {
        this.floor = floor;
    }

    public void updateRoomNumber(Integer roomNumber) {
        this.roomNumber = roomNumber;
    }

    public void updateSpecifics(String specifics) {
        this.specifics = specifics;
    }

    public void updateTemperature(Float temperature) {
        this.temperature = temperature;
    }

    public void updateUrgencyLevel(Integer urgencyLevel) {
        this.urgencyLevel = urgencyLevel;
    }
}
