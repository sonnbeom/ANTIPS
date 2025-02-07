package backend.emergency.repository;

import backend.emergency.domain.Fcm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FcmTokenRepository extends JpaRepository<Fcm, Long> {
    Optional<Fcm> findByToken(String token);
}
