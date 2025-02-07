package backend.emergency.domain;

import backend.common.domain.BaseEntity;
import backend.emergency.dto.response.ResponseFcmDto;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fcm")
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Fcm extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fcm_id", nullable = false)
    private Long id;
    private String token;

    public ResponseFcmDto entityToDto(Fcm fcm) {
        return ResponseFcmDto.builder()
                .id(fcm.id)
                .token(fcm.token)
                .createdAt(getCreatedAt())
                .build();
    }
}
