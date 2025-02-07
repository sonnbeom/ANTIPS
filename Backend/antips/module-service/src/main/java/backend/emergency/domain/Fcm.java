package backend.emergency.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "fcm")
@NoArgsConstructor
@Builder
@AllArgsConstructor
public class Fcm {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "fcm_id", nullable = false)
    private Long id;
    private String token;

}
