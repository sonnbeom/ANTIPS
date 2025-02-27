package backend.emergency.domain;

import backend.common.domain.BaseEntity;
import backend.emergency.dto.response.ResponseEmergencyDto;
import backend.patient.domain.Patient;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "emergency")
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Emergency extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "emergency_id", nullable = false)
    private Long id;
    private String title;
    private String content;
    private boolean active;
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    public ResponseEmergencyDto entityToDto(Emergency emergency){
        return ResponseEmergencyDto.builder()
                .id(emergency.id)
                .content(emergency.content)
                .patientDto(patient.entityToDto(patient))
                .title(emergency.title)
                .createdAt(emergency.getCreatedAt())
                .build();
    }

    public void deactivate(Emergency emergency) {
        emergency.active = false;
    }
}
