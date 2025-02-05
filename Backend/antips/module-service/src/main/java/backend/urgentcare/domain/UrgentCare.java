package backend.urgentcare.domain;

import backend.common.domain.BaseEntity;
import backend.patient.domain.Patient;
import backend.urgentcare.dto.response.ResponseUrgentCareDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;

import java.time.LocalDateTime;

@Entity
@Table(name = "urgent_care")
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class UrgentCare extends BaseEntity{
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "urgent_care_id", nullable = false)
    private Long id;
    @Column(nullable = false)
    private String content;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id")
    private Patient patient;

    public ResponseUrgentCareDto entityToDto(UrgentCare savedUrgentCare) {
        return ResponseUrgentCareDto.builder()
                .urgentCareId(savedUrgentCare.id)
                .content(savedUrgentCare.content)
                .createdAt(savedUrgentCare.getCreatedAt())
                .build();
    }
}
